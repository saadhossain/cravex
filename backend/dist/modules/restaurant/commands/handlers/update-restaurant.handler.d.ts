import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { UpdateRestaurantCommand } from '../index';
export declare class UpdateRestaurantHandler implements ICommandHandler<UpdateRestaurantCommand> {
    private readonly restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    execute(command: UpdateRestaurantCommand): Promise<RestaurantResponseDto>;
}
