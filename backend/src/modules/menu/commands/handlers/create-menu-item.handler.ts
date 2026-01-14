import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Category,
  MenuItem,
  MenuOption,
  MenuOptionGroup,
  Restaurant,
} from '../../../../domain/entities';
import { MenuItemResponseDto } from '../../dto';
import { CreateMenuItemCommand } from '../index';

@CommandHandler(CreateMenuItemCommand)
export class CreateMenuItemHandler implements ICommandHandler<CreateMenuItemCommand> {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateMenuItemCommand): Promise<MenuItemResponseDto> {
    const { ownerId, dto } = command;

    // 1. Validate Category and Ownership
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
      relations: ['restaurant'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    // 2. Create MenuItem and Options in Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create MenuItem
      const menuItem = queryRunner.manager.create(MenuItem, {
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
        // displayOrder? if missing append?
      });

      const savedMenuItem = await queryRunner.manager.save(menuItem);

      // Create Option Groups
      if (dto.optionGroups && dto.optionGroups.length > 0) {
        for (const groupDto of dto.optionGroups) {
          const group = queryRunner.manager.create(MenuOptionGroup, {
            ...groupDto,
            menuItemId: savedMenuItem.id,
          });
          const savedGroup = await queryRunner.manager.save(group);

          // Create Options
          if (groupDto.options && groupDto.options.length > 0) {
            const options = groupDto.options.map((optDto) =>
              queryRunner.manager.create(MenuOption, {
                ...optDto,
                groupId: savedGroup.id,
              }),
            );
            await queryRunner.manager.save(options);
          }
        }
      }

      await queryRunner.commitTransaction();

      // Fetch complete item for response
      const completeItem = await this.menuItemRepository.findOne({
        where: { id: savedMenuItem.id },
        relations: ['optionGroups', 'optionGroups.options'],
      });

      return MenuItemResponseDto.fromEntity(completeItem!);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create menu item');
    } finally {
      await queryRunner.release();
    }
  }
}
