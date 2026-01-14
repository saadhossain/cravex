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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRestaurantHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const slugify_1 = __importDefault(require("slugify"));
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let CreateRestaurantHandler = class CreateRestaurantHandler {
    restaurantRepository;
    userRepository;
    constructor(restaurantRepository, userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }
    async execute(command) {
        const { ownerId, dto } = command;
        const existingRestaurant = await this.restaurantRepository.findOne({
            where: { ownerId },
        });
        if (existingRestaurant) {
            throw new common_1.ConflictException('User already owns a restaurant');
        }
        let slug = (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        const slugExists = await this.restaurantRepository.findOne({
            where: { slug },
        });
        if (slugExists) {
            slug = `${slug}-${Date.now()}`;
        }
        const restaurant = this.restaurantRepository.create({
            ...dto,
            slug,
            ownerId,
            isActive: true,
        });
        try {
            const savedRestaurant = await this.restaurantRepository.save(restaurant);
            await this.userRepository.update(ownerId, { role: 'restaurant' });
            return dto_1.RestaurantResponseDto.fromEntity(savedRestaurant);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create restaurant');
        }
    }
};
exports.CreateRestaurantHandler = CreateRestaurantHandler;
exports.CreateRestaurantHandler = CreateRestaurantHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.CreateRestaurantCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreateRestaurantHandler);
//# sourceMappingURL=create-restaurant.handler.js.map