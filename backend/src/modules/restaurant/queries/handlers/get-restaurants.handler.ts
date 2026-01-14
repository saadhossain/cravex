import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { PaginatedResponseDto, RestaurantResponseDto } from '../../dto';
import { GetRestaurantsQuery } from '../index';

@QueryHandler(GetRestaurantsQuery)
export class GetRestaurantsHandler implements IQueryHandler<GetRestaurantsQuery> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(
    query: GetRestaurantsQuery,
  ): Promise<PaginatedResponseDto<RestaurantResponseDto>> {
    const {
      search,
      postcode,
      cuisineTypes,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder = 'asc',
    } = query.query;

    const queryBuilder =
      this.restaurantRepository.createQueryBuilder('restaurant');

    queryBuilder.where('restaurant.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(restaurant.name) LIKE LOWER(:search) OR LOWER(restaurant.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Postcode filtering would ideally use geospatial query (PostGIS) or simple text match for now
    if (postcode) {
      // Simplistic implementation: check if postcode is in address or covered zones
      // Ideally we would join with DeliveryZone
      queryBuilder.leftJoinAndSelect('restaurant.deliveryZones', 'zone');
      queryBuilder.andWhere('zone.postcode LIKE :postcode', {
        postcode: `${postcode}%`,
      });
    }

    if (cuisineTypes && cuisineTypes.length > 0) {
      // Postgres array overlap
      // queryBuilder.andWhere('restaurant.cuisineTypes && :cuisineTypes', { cuisineTypes });
      // For simple-array in TypeORM, it's a string comma separated, so we might need LIKE
      // But let's assume standard postgres array if we configured it as 'text[]' or similar,
      // strict 'simple-array' is string. The entity definition was 'simple-array'.
      // simple-array stores as "A,B,C".
      // We'll iterate for OR logic for now or custom string match

      // Let's use a bracket for simple logic:
      const conditions = cuisineTypes.map((type, index) => {
        return `restaurant.cuisineTypes LIKE :type${index}`;
      });
      queryBuilder.andWhere(
        `(${conditions.join(' OR ')})`,
        cuisineTypes.reduce(
          (acc, type, index) => ({ ...acc, [`type${index}`]: `%${type}%` }),
          {},
        ),
      );
    }

    if (sortBy) {
      queryBuilder.orderBy(
        `restaurant.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      queryBuilder.orderBy('restaurant.isFeatured', 'DESC'); // Default sort
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items.map(RestaurantResponseDto.fromEntity),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
