import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Restaurant, User } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { CreateRestaurantCommand } from '../index';
export declare class CreateRestaurantHandler implements ICommandHandler<CreateRestaurantCommand> {
    private readonly restaurantRepository;
    private readonly userRepository;
    constructor(restaurantRepository: Repository<Restaurant>, userRepository: Repository<User>);
    execute(command: CreateRestaurantCommand): Promise<RestaurantResponseDto>;
}
