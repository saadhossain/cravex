import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { PaginatedResponseDto, RestaurantResponseDto } from '../../dto';
import { GetRestaurantsQuery } from '../index';
export declare class GetRestaurantsHandler implements IQueryHandler<GetRestaurantsQuery> {
    private readonly restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    execute(query: GetRestaurantsQuery): Promise<PaginatedResponseDto<RestaurantResponseDto>>;
}
