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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemOption = void 0;
const typeorm_1 = require("typeorm");
const auditable_entity_1 = require("../../shared/domain/auditable.entity");
const cart_item_entity_1 = require("./cart-item.entity");
const menu_option_entity_1 = require("./menu-option.entity");
let CartItemOption = class CartItemOption extends auditable_entity_1.Auditable {
    additionalPrice;
    cartItem;
    cartItemId;
    menuOption;
    menuOptionId;
};
exports.CartItemOption = CartItemOption;
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CartItemOption.prototype, "additionalPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cart_item_entity_1.CartItem, (cartItem) => cartItem.selectedOptions, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", cart_item_entity_1.CartItem)
], CartItemOption.prototype, "cartItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CartItemOption.prototype, "cartItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_option_entity_1.MenuOption),
    __metadata("design:type", menu_option_entity_1.MenuOption)
], CartItemOption.prototype, "menuOption", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CartItemOption.prototype, "menuOptionId", void 0);
exports.CartItemOption = CartItemOption = __decorate([
    (0, typeorm_1.Entity)('cart_item_options')
], CartItemOption);
//# sourceMappingURL=cart-item-option.entity.js.map