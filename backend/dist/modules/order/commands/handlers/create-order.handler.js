"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../../../../domain/entities/order.entity");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let CreateOrderHandler = class CreateOrderHandler {
    cartRepository;
    userRepository;
    restaurantRepository;
    dataSource;
    constructor(cartRepository, userRepository, restaurantRepository, dataSource) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.dataSource = dataSource;
    }
    async execute(command) {
        const { userId, dto } = command;
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: [
                'items',
                'items.menuItem',
                'items.selectedOptions',
                'items.selectedOptions.menuOption',
                'restaurant',
            ],
        });
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        if (!cart.restaurant) {
            throw new common_1.InternalServerErrorException('Cart is missing restaurant data');
        }
        let itemsTotal = 0;
        const orderItemsData = [];
        for (const item of cart.items) {
            if (!item.menuItem)
                continue;
            let optionsTotal = 0;
            const optionsData = [];
            if (item.selectedOptions) {
                for (const opt of item.selectedOptions) {
                    if (opt.menuOption) {
                        optionsTotal += Number(opt.menuOption.additionalPrice);
                        optionsData.push({
                            optionName: opt.menuOption.name,
                            price: Number(opt.menuOption.additionalPrice),
                        });
                    }
                }
            }
            const unitPrice = Number(item.menuItem.price);
            const lineTotal = (unitPrice + optionsTotal) * item.quantity;
            itemsTotal += lineTotal;
            orderItemsData.push({
                menuItemName: item.menuItem.name,
                menuItemId: item.menuItem.id,
                price: unitPrice,
                quantity: item.quantity,
                totalPrice: lineTotal,
                options: optionsData,
            });
        }
        let deliveryFee = 0;
        if (dto.deliveryType === 'delivery') {
            deliveryFee = Number(cart.restaurant.deliveryFee);
            const minDelivery = Number(cart.restaurant.minimumDelivery);
            if (itemsTotal < minDelivery) {
                throw new common_1.BadRequestException(`Minimum delivery amount of ${minDelivery} not met`);
            }
        }
        const discountAmount = 0;
        const totalAmount = itemsTotal + deliveryFee - discountAmount;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = queryRunner.manager.create(order_entity_1.Order, {
                userId,
                restaurantId: cart.restaurantId,
                status: 'pending',
                total: totalAmount,
                subtotal: itemsTotal,
                deliveryFee,
                discount: discountAmount,
                deliveryType: dto.deliveryType,
                paymentMethod: dto.paymentMethod,
                paymentStatus: 'pending',
                specialInstructions: dto.note,
                deliveryAddressId: dto.addressId,
                orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
            });
            const savedOrder = await queryRunner.manager.save(order);
            for (const itemData of orderItemsData) {
                const orderItem = queryRunner.manager.create(entities_1.OrderItem, {
                    orderId: savedOrder.id,
                    menuItemName: itemData.menuItemName,
                    menuItemId: itemData.menuItemId,
                    unitPrice: itemData.price,
                    quantity: itemData.quantity,
                    totalPrice: itemData.totalPrice,
                });
                const savedOrderItem = await queryRunner.manager.save(orderItem);
                if (itemData.options && itemData.options.length > 0) {
                    const orderItemOptions = itemData.options.map((opt) => queryRunner.manager.create(entities_1.OrderItemOption, {
                        orderItemId: savedOrderItem.id,
                        optionName: opt.optionName,
                        additionalPrice: opt.price,
                    }));
                    await queryRunner.manager.save(orderItemOptions);
                }
            }
            await queryRunner.manager.delete(entities_1.CartItem, { cartId: cart.id });
            cart.restaurantId = null;
            await queryRunner.manager.update(entities_1.Cart, cart.id, { restaurantId: null });
            await queryRunner.commitTransaction();
            const fullOrder = await this.dataSource.manager.findOne(order_entity_1.Order, {
                where: { id: savedOrder.id },
                relations: ['items', 'items.selectedOptions', 'restaurant'],
            });
            return dto_1.OrderResponseDto.fromEntity(fullOrder);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.CreateOrderHandler = CreateOrderHandler;
exports.CreateOrderHandler = CreateOrderHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.CreateOrderCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CreateOrderHandler);
//# sourceMappingURL=create-order.handler.js.map