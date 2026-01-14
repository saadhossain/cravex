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
exports.DealItem = void 0;
const typeorm_1 = require("typeorm");
const auditable_entity_1 = require("../../shared/domain/auditable.entity");
const category_entity_1 = require("./category.entity");
const deal_entity_1 = require("./deal.entity");
const menu_item_entity_1 = require("./menu-item.entity");
let DealItem = class DealItem extends auditable_entity_1.Auditable {
    stepNumber;
    stepTitle;
    stepType;
    quantity;
    allowMultipleSame;
    deal;
    dealId;
    menuItem;
    menuItemId;
    category;
    categoryId;
};
exports.DealItem = DealItem;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DealItem.prototype, "stepNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DealItem.prototype, "stepTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['select', 'customize'],
        default: 'select',
    }),
    __metadata("design:type", String)
], DealItem.prototype, "stepType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], DealItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DealItem.prototype, "allowMultipleSame", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deal_entity_1.Deal, (deal) => deal.dealItems),
    __metadata("design:type", deal_entity_1.Deal)
], DealItem.prototype, "deal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DealItem.prototype, "dealId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, { nullable: true }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], DealItem.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DealItem.prototype, "menuItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { nullable: true }),
    __metadata("design:type", category_entity_1.Category)
], DealItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DealItem.prototype, "categoryId", void 0);
exports.DealItem = DealItem = __decorate([
    (0, typeorm_1.Entity)('deal_items')
], DealItem);
//# sourceMappingURL=deal-item.entity.js.map