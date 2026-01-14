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
exports.UpdateCartItemHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const index_1 = require("../index");
let UpdateCartItemHandler = class UpdateCartItemHandler {
    cartItemRepository;
    menuOptionRepository;
    dataSource;
    constructor(cartItemRepository, menuOptionRepository, dataSource) {
        this.cartItemRepository = cartItemRepository;
        this.menuOptionRepository = menuOptionRepository;
        this.dataSource = dataSource;
    }
    async execute(command) {
        const { userId, cartItemId, dto } = command;
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'selectedOptions'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this cart');
        }
        if (dto.quantity) {
            cartItem.quantity = dto.quantity;
        }
        if (dto.specialInstructions !== undefined) {
            cartItem.specialInstructions = dto.specialInstructions;
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(cartItem);
            if (dto.selectedOptions) {
                await queryRunner.manager.delete(entities_1.CartItemOption, {
                    cartItemId: cartItem.id,
                });
                const optionIds = dto.selectedOptions.flatMap((so) => so.optionIds);
                if (optionIds.length > 0) {
                    const options = await this.menuOptionRepository.findByIds(optionIds);
                    const cartItemOptions = options.map((opt) => queryRunner.manager.create(entities_1.CartItemOption, {
                        cartItemId: cartItem.id,
                        menuOptionId: opt.id,
                        additionalPrice: opt.additionalPrice,
                    }));
                    await queryRunner.manager.save(cartItemOptions);
                }
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
        if (!cartItem)
            throw new common_1.NotFoundException();
        return { id: cartItem.cart.id, items: [] };
    }
};
exports.UpdateCartItemHandler = UpdateCartItemHandler;
exports.UpdateCartItemHandler = UpdateCartItemHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.UpdateCartItemCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.CartItem)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MenuOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], UpdateCartItemHandler);
//# sourceMappingURL=update-cart-item.handler.js.map