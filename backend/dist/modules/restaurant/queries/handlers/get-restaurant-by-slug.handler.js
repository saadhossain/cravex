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
exports.GetRestaurantBySlugHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let GetRestaurantBySlugHandler = class GetRestaurantBySlugHandler {
    restaurantRepository;
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    async execute(query) {
        const { slug } = query;
        const restaurant = await this.restaurantRepository.findOne({
            where: { slug },
            relations: ['categories', 'deals', 'deliveryZones'],
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restaurant not found');
        }
        const dto = new dto_1.RestaurantDetailDto();
        Object.assign(dto, dto_1.RestaurantDetailDto.fromEntity(restaurant));
        dto.openingHours = restaurant.openingHours;
        dto.latitude = Number(restaurant.latitude);
        dto.longitude = Number(restaurant.longitude);
        dto.phone = restaurant.phone;
        dto.email = restaurant.email;
        return dto;
    }
};
exports.GetRestaurantBySlugHandler = GetRestaurantBySlugHandler;
exports.GetRestaurantBySlugHandler = GetRestaurantBySlugHandler = __decorate([
    (0, cqrs_1.QueryHandler)(index_1.GetRestaurantBySlugQuery),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetRestaurantBySlugHandler);
//# sourceMappingURL=get-restaurant-by-slug.handler.js.map