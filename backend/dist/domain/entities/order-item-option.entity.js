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
exports.OrderItemOption = void 0;
const typeorm_1 = require("typeorm");
const auditable_entity_1 = require("../../shared/domain/auditable.entity");
const menu_option_entity_1 = require("./menu-option.entity");
const order_item_entity_1 = require("./order-item.entity");
let OrderItemOption = class OrderItemOption extends auditable_entity_1.Auditable {
    optionName;
    additionalPrice;
    orderItem;
    orderItemId;
    menuOption;
    menuOptionId;
};
exports.OrderItemOption = OrderItemOption;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItemOption.prototype, "optionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrderItemOption.prototype, "additionalPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_entity_1.OrderItem, (orderItem) => orderItem.selectedOptions, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", order_item_entity_1.OrderItem)
], OrderItemOption.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItemOption.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_option_entity_1.MenuOption),
    __metadata("design:type", menu_option_entity_1.MenuOption)
], OrderItemOption.prototype, "menuOption", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItemOption.prototype, "menuOptionId", void 0);
exports.OrderItemOption = OrderItemOption = __decorate([
    (0, typeorm_1.Entity)('order_item_options')
], OrderItemOption);
//# sourceMappingURL=order-item-option.entity.js.map