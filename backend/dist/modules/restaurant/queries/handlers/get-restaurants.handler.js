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
exports.GetRestaurantsHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let GetRestaurantsHandler = class GetRestaurantsHandler {
    restaurantRepository;
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    async execute(query) {
        const { search, postcode, cuisineTypes, page = 1, limit = 20, sortBy, sortOrder = 'asc', } = query.query;
        const queryBuilder = this.restaurantRepository.createQueryBuilder('restaurant');
        queryBuilder.where('restaurant.isActive = :isActive', { isActive: true });
        if (search) {
            queryBuilder.andWhere('(LOWER(restaurant.name) LIKE LOWER(:search) OR LOWER(restaurant.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        if (postcode) {
            queryBuilder.leftJoinAndSelect('restaurant.deliveryZones', 'zone');
            queryBuilder.andWhere('zone.postcode LIKE :postcode', {
                postcode: `${postcode}%`,
            });
        }
        if (cuisineTypes && cuisineTypes.length > 0) {
            const conditions = cuisineTypes.map((type, index) => {
                return `restaurant.cuisineTypes LIKE :type${index}`;
            });
            queryBuilder.andWhere(`(${conditions.join(' OR ')})`, cuisineTypes.reduce((acc, type, index) => ({ ...acc, [`type${index}`]: `%${type}%` }), {}));
        }
        if (sortBy) {
            queryBuilder.orderBy(`restaurant.${sortBy}`, sortOrder.toUpperCase());
        }
        else {
            queryBuilder.orderBy('restaurant.isFeatured', 'DESC');
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            data: items.map(dto_1.RestaurantResponseDto.fromEntity),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.GetRestaurantsHandler = GetRestaurantsHandler;
exports.GetRestaurantsHandler = GetRestaurantsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(index_1.GetRestaurantsQuery),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetRestaurantsHandler);
//# sourceMappingURL=get-restaurants.handler.js.map