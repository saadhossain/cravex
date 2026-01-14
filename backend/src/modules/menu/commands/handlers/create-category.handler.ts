import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Category, Restaurant } from '../../../../domain/entities';
import { CreateCategoryCommand } from '../index';
// Plan says `CategoryWithItemsDto` or just creation response. I'll use simple mapping or `CategoryWithItemsDto` with empty items.

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<any> {
    const { ownerId, dto } = command;

    // Verify restaurant ownership
    const restaurant = await this.restaurantRepository.findOne({
      where: { ownerId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found for this user');
    }

    // Generate slug
    let slug = slugify(dto.name, { lower: true, strict: true });

    // Check slug collision (global per schema)
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create category
    const category = this.categoryRepository.create({
      ...dto,
      slug,
      restaurantId: restaurant.id,
      isActive: true, // Default
    });

    // Handle displayOrder if not provided (append to end)
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

    return savedCategory; // Returning entity mostly fine, or map to DTO
  }
}
