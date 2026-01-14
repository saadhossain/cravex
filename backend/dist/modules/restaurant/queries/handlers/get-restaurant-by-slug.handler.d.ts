import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantDetailDto } from '../../dto';
import { GetRestaurantBySlugQuery } from '../index';
export declare class GetRestaurantBySlugHandler implements IQueryHandler<GetRestaurantBySlugQuery> {
    private readonly restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    execute(query: GetRestaurantBySlugQuery): Promise<RestaurantDetailDto>;
}
