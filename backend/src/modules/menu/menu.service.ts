import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import {
  AdminDishesQueryDto,
  CreateAdminDishDto,
  UpdateAdminDishDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getDishesAdmin(query: AdminDishesQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      restaurantId,
      categoryId,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.menuItemRepository
      .createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.category', 'category')
      .leftJoinAndSelect('category.restaurant', 'restaurant');

    if (search) {
      queryBuilder.andWhere(
        '(menuItem.name ILIKE :search OR menuItem.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (restaurantId) {
      queryBuilder.andWhere('category.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('menuItem.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('menuItem.isAvailable = :isAvailable', {
        isAvailable,
      });
    }

    const validSortFields = ['createdAt', 'name', 'price', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`menuItem.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [dishes, total] = await queryBuilder.getManyAndCount();

    const mappedDishes = dishes.map((dish) => ({
      ...dish,
      restaurant: dish.category?.restaurant,
      restaurantId: dish.category?.restaurantId,
    }));

    return {
      data: mappedDishes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDishById(id: string) {
    const dish = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['category', 'category.restaurant'],
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return {
      ...dish,
      restaurant: dish.category?.restaurant,
      restaurantId: dish.category?.restaurantId,
    };
  }

  async createDishAdmin(dto: CreateAdminDishDto) {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
      relations: ['restaurant'],
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${dto.categoryId} not found`,
      );
    }

    const dish = this.menuItemRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId,
      imageUrl: dto.imageUrl,
      isAvailable: dto.isAvailable ?? true,
      isPopular: dto.isPopular ?? false,
      isVegetarian: dto.isVegetarian ?? false,
      isVegan: dto.isVegan ?? false,
      isSpicy: dto.isSpicy ?? false,
      spicyLevel: dto.spicyLevel,
      calories: dto.calories,
      preparationTime: dto.preparationTime,
      allergens: dto.allergens,
      tags: dto.tags,
      displayOrder: dto.displayOrder ?? 0,
    });

    const savedDish = await this.menuItemRepository.save(dish);

    return this.getDishById(savedDish.id);
  }

  async updateDishAdmin(id: string, dto: UpdateAdminDishDto) {
    const existingDish = await this.menuItemRepository.findOne({
      where: { id },
    });

    if (!existingDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    // If categoryId is changing, verify the new category exists
    if (dto.categoryId && dto.categoryId !== existingDish.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    await this.menuItemRepository.update(id, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId,
      imageUrl: dto.imageUrl,
      isAvailable: dto.isAvailable,
      isPopular: dto.isPopular,
      isVegetarian: dto.isVegetarian,
      isVegan: dto.isVegan,
      isSpicy: dto.isSpicy,
      spicyLevel: dto.spicyLevel,
      calories: dto.calories,
      preparationTime: dto.preparationTime,
      allergens: dto.allergens,
      tags: dto.tags,
      displayOrder: dto.displayOrder,
    });

    return this.getDishById(id);
  }

  async deleteDishAdmin(id: string) {
    const dish = await this.menuItemRepository.findOne({
      where: { id },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    await this.menuItemRepository.softDelete(id);

    return { message: 'Dish deleted successfully' };
  }

  async getCategoriesForRestaurant(restaurantId: string) {
    const categories = await this.categoryRepository.find({
      where: { restaurantId, isActive: true },
      order: { displayOrder: 'ASC', name: 'ASC' },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));
  }
}
