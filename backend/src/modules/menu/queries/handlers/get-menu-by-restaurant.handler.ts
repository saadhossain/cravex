import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../../domain/entities';
import { CategoryWithItemsDto } from '../../dto';
import { GetMenuByRestaurantQuery } from '../index';

@QueryHandler(GetMenuByRestaurantQuery)
export class GetMenuByRestaurantHandler implements IQueryHandler<GetMenuByRestaurantQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(
    query: GetMenuByRestaurantQuery,
  ): Promise<CategoryWithItemsDto[]> {
    const { restaurantId } = query;

    const categories = await this.categoryRepository.find({
      where: { restaurantId, isActive: true },
      order: { displayOrder: 'ASC' },
      relations: [
        'menuItems',
        'menuItems.optionGroups',
        'menuItems.optionGroups.options',
      ],
    });

    // Map to DTOs
    return categories.map(CategoryWithItemsDto.fromEntity);
  }
}
