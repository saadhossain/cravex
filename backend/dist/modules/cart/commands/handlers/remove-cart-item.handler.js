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
exports.RemoveCartItemHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const index_1 = require("../index");
let RemoveCartItemHandler = class RemoveCartItemHandler {
    cartItemRepository;
    constructor(cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }
    async execute(command) {
        const { userId, cartItemId } = command;
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this cart');
        }
        await this.cartItemRepository.remove(cartItem);
    }
};
exports.RemoveCartItemHandler = RemoveCartItemHandler;
exports.RemoveCartItemHandler = RemoveCartItemHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.RemoveCartItemCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RemoveCartItemHandler);
//# sourceMappingURL=remove-cart-item.handler.js.map