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
exports.GetMenuByRestaurantHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let GetMenuByRestaurantHandler = class GetMenuByRestaurantHandler {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(query) {
        const { restaurantId } = query;
        const categories = await this.categoryRepository.find({
            where: { restaurantId, isActive: true },
            order: { displayOrder: 'ASC' },
            relations: [
                'menuItems',
                'menuItems.optionGroups',
                'menuItems.optionGroups.options',
            ],
        });
        return categories.map(dto_1.CategoryWithItemsDto.fromEntity);
    }
};
exports.GetMenuByRestaurantHandler = GetMenuByRestaurantHandler;
exports.GetMenuByRestaurantHandler = GetMenuByRestaurantHandler = __decorate([
    (0, cqrs_1.QueryHandler)(index_1.GetMenuByRestaurantQuery),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetMenuByRestaurantHandler);
//# sourceMappingURL=get-menu-by-restaurant.handler.js.map