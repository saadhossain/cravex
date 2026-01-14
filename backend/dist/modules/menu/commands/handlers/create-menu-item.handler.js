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
exports.CreateMenuItemHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../../domain/entities");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let CreateMenuItemHandler = class CreateMenuItemHandler {
    menuItemRepository;
    categoryRepository;
    restaurantRepository;
    dataSource;
    constructor(menuItemRepository, categoryRepository, restaurantRepository, dataSource) {
        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
        this.restaurantRepository = restaurantRepository;
        this.dataSource = dataSource;
    }
    async execute(command) {
        const { ownerId, dto } = command;
        const category = await this.categoryRepository.findOne({
            where: { id: dto.categoryId },
            relations: ['restaurant'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.restaurant.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not own this restaurant');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const menuItem = queryRunner.manager.create(entities_1.MenuItem, {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                categoryId: dto.categoryId,
                isVegetarian: dto.isVegetarian,
                isVegan: dto.isVegan,
                isSpicy: dto.isSpicy,
                spicyLevel: dto.spicyLevel,
                calories: dto.calories,
                allergens: dto.allergens,
                tags: dto.tags,
            });
            const savedMenuItem = await queryRunner.manager.save(menuItem);
            if (dto.optionGroups && dto.optionGroups.length > 0) {
                for (const groupDto of dto.optionGroups) {
                    const group = queryRunner.manager.create(entities_1.MenuOptionGroup, {
                        ...groupDto,
                        menuItemId: savedMenuItem.id,
                    });
                    const savedGroup = await queryRunner.manager.save(group);
                    if (groupDto.options && groupDto.options.length > 0) {
                        const options = groupDto.options.map((optDto) => queryRunner.manager.create(entities_1.MenuOption, {
                            ...optDto,
                            groupId: savedGroup.id,
                        }));
                        await queryRunner.manager.save(options);
                    }
                }
            }
            await queryRunner.commitTransaction();
            const completeItem = await this.menuItemRepository.findOne({
                where: { id: savedMenuItem.id },
                relations: ['optionGroups', 'optionGroups.options'],
            });
            return dto_1.MenuItemResponseDto.fromEntity(completeItem);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Failed to create menu item');
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.CreateMenuItemHandler = CreateMenuItemHandler;
exports.CreateMenuItemHandler = CreateMenuItemHandler = __decorate([
    (0, cqrs_1.CommandHandler)(index_1.CreateMenuItemCommand),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.MenuItem)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CreateMenuItemHandler);
//# sourceMappingURL=create-menu-item.handler.js.map