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
exports.CreateCategoryHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const slugify_1 = __importDefault(require("slugify"));
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const index_1 = require("../index");
let CreateCategoryHandler = class CreateCategoryHandler {
    categoryRepository;
    restaurantRepository;
    constructor(categoryRepository, restaurantRepository) {
        this.categoryRepository = categoryRepository;
        this.restaurantRepository = restaurantRepository;
    }
    async execute(command) {
        const { ownerId, dto } = command;
        const restaurant = await this.restaurantRepository.findOne({
            where: { ownerId },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restaurant not found for this user');
        }
        let slug = (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        const existingSlug = await this.categoryRepository.findOne({
            where: { slug },
        });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }
        const category = this.categoryRepository.create({
            ...dto,
            slug,
            restaurantId: restaurant.id,
            isActive: true,
        });
        if (dto.displayOrder === undefined) {
            const maxOrder = await this.categoryRepository
                .createQueryBuilder('category')
                .where('category.restaurantId = :restaurantId', {
                restaurantId: restaurant.id,
            })
                .select('MAX(category.displayOrder)', 'max')
                .getRawOne();
            category.displayOrder = (maxOrder?.max || 0) + 1;
        }
        const savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }
};
exports.CreateCategoryHandler = CreateCategoryHandler;
exports.CreateCategoryHandler = CreateCategoryHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.CreateCategoryCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreateCategoryHandler);
//# sourceMappingURL=create-category.handler.js.map