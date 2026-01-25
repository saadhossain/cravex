import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { AdminDishesQueryDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
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
}
