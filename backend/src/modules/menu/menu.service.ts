import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import {
  AdminCategoriesQueryDto,
  AdminDishesQueryDto,
  CreateAdminCategoryDto,
  CreateAdminDishDto,
  UpdateAdminCategoryDto,
  UpdateAdminDishDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  // ============ Category Admin Methods ============

  async getCategoriesAdmin(query: AdminCategoriesQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      restaurantId,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.restaurant', 'restaurant');

    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (restaurantId) {
      queryBuilder.andWhere('category.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    const validSortFields = ['createdAt', 'name', 'displayOrder'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`category.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Ensure restaurantId is always present in the response
    return {
      ...category,
      restaurantId: category.restaurantId || category.restaurant?.id,
    };
  }

  async createCategoryAdmin(dto: CreateAdminCategoryDto) {
    // Verify restaurant exists
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${dto.restaurantId} not found`,
      );
    }

    // Generate slug from name
    const baseSlug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for slug uniqueness and append suffix if needed
    let slug = baseSlug;
    let suffix = 1;
    while (await this.categoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const category = this.categoryRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      imageUrl: dto.imageUrl,
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive ?? true,
      restaurantId: dto.restaurantId,
    });

    const savedCategory = await this.categoryRepository.save(category);

    return this.getCategoryById(savedCategory.id);
  }

  async updateCategoryAdmin(id: string, dto: UpdateAdminCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // If name is changing, update the slug
    let slug = existingCategory.slug;
    if (dto.name && dto.name !== existingCategory.name) {
      const baseSlug = dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      slug = baseSlug;
      let suffix = 1;
      while (true) {
        const existing = await this.categoryRepository.findOne({
          where: { slug },
        });
        if (!existing || existing.id === id) break;
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    await this.categoryRepository.update(id, {
      name: dto.name,
      slug: dto.name ? slug : undefined,
      description: dto.description,
      imageUrl: dto.imageUrl,
      displayOrder: dto.displayOrder,
      isActive: dto.isActive,
    });

    return this.getCategoryById(id);
  }

  async deleteCategoryAdmin(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has menu items
    if (category.menuItems && category.menuItems.length > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category.menuItems.length} menu items. Remove all items first.`,
      );
    }

    await this.categoryRepository.remove(category);

    return { message: 'Category deleted successfully' };
  }

  // ============ Dish Admin Methods ============

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

  // ============ Public Methods for Home Page ============

  async getPublicCategories(limit: number = 8) {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC', name: 'ASC' },
      take: limit,
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
    }));
  }

  async getFeaturedDishes(limit: number = 4) {
    const dishes = await this.menuItemRepository.find({
      where: { isAvailable: true, isPopular: true },
      relations: ['category', 'category.restaurant'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return dishes.map((dish) => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: Number(dish.price),
      imageUrl: dish.imageUrl,
      preparationTime: dish.preparationTime,
      restaurant: dish.category?.restaurant
        ? {
            id: dish.category.restaurant.id,
            name: dish.category.restaurant.name,
            rating: Number(dish.category.restaurant.rating),
          }
        : null,
    }));
  }

  async getPopularDishes(limit: number = 8) {
    const dishes = await this.menuItemRepository.find({
      where: { isAvailable: true },
      relations: ['category', 'category.restaurant'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return dishes.map((dish) => ({
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      imageUrl: dish.imageUrl,
      preparationTime: dish.preparationTime,
      isPopular: dish.isPopular,
      category: dish.category
        ? {
            id: dish.category.id,
            name: dish.category.name,
          }
        : null,
      restaurant: dish.category?.restaurant
        ? {
            id: dish.category.restaurant.id,
            name: dish.category.restaurant.name,
            rating: Number(dish.category.restaurant.rating),
          }
        : null,
    }));
  }
}
