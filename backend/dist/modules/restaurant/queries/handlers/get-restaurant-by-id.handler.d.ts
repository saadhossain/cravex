import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { GetRestaurantByIdQuery } from '../index';
export declare class GetRestaurantByIdHandler implements IQueryHandler<GetRestaurantByIdQuery> {
    private readonly restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    execute(query: GetRestaurantByIdQuery): Promise<RestaurantResponseDto>;
}
