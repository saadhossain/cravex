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
exports.AddToCartHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let AddToCartHandler = class AddToCartHandler {
    cartRepository;
    menuItemRepository;
    menuOptionRepository;
    dataSource;
    constructor(cartRepository, menuItemRepository, menuOptionRepository, dataSource) {
        this.cartRepository = cartRepository;
        this.menuItemRepository = menuItemRepository;
        this.menuOptionRepository = menuOptionRepository;
        this.dataSource = dataSource;
    }
    async execute(command) {
        const { userId, dto } = command;
        const menuItem = await this.menuItemRepository.findOne({
            where: { id: dto.menuItemId },
            relations: [
                'category',
                'category.restaurant',
                'optionGroups',
                'optionGroups.options',
            ],
        });
        if (!menuItem) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        if (!menuItem.isAvailable) {
            throw new common_1.BadRequestException('Menu item is currently unavailable');
        }
        const restaurantId = menuItem.category.restaurantId;
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.selectedOptions'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ userId, restaurantId });
            await this.cartRepository.save(cart);
        }
        if (cart.restaurantId && cart.restaurantId !== restaurantId) {
            const hasItems = await this.cartRepository
                .createQueryBuilder('cart')
                .leftJoin('cart.items', 'items')
                .where('cart.id = :id', { id: cart.id })
                .andWhere('items.id IS NOT NULL')
                .getCount();
            if (hasItems > 0) {
                throw new common_1.ConflictException('Cart contains items from a different restaurant. Clear cart first.');
            }
            else {
                cart.restaurantId = restaurantId;
                await this.cartRepository.save(cart);
            }
        }
        else if (!cart.restaurantId) {
            cart.restaurantId = restaurantId;
            await this.cartRepository.save(cart);
        }
        const selectedOptionsEntities = [];
        if (dto.selectedOptions && dto.selectedOptions.length > 0) {
            const optionIds = dto.selectedOptions.flatMap((so) => so.optionIds);
            if (optionIds.length > 0) {
                const options = await this.menuOptionRepository.findByIds(optionIds);
                selectedOptionsEntities.push(...options);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cartItem = queryRunner.manager.create(entities_1.CartItem, {
                cartId: cart.id,
                menuItemId: menuItem.id,
                quantity: dto.quantity,
                unitPrice: menuItem.price,
                specialInstructions: dto.specialInstructions,
            });
            const savedItem = await queryRunner.manager.save(cartItem);
            if (selectedOptionsEntities.length > 0) {
                const cartItemOptions = selectedOptionsEntities.map((opt) => queryRunner.manager.create(entities_1.CartItemOption, {
                    cartItemId: savedItem.id,
                    menuOptionId: opt.id,
                    additionalPrice: opt.additionalPrice,
                }));
                await queryRunner.manager.save(cartItemOptions);
            }
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
        const updatedCart = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: [
                'restaurant',
                'items',
                'items.menuItem',
                'items.selectedOptions',
                'items.selectedOptions.menuOption',
            ],
        });
        return dto_1.CartResponseDto.fromEntity(updatedCart);
    }
};
exports.AddToCartHandler = AddToCartHandler;
exports.AddToCartHandler = AddToCartHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.AddToCartCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MenuItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.MenuOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AddToCartHandler);
//# sourceMappingURL=add-to-cart.handler.js.map