import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { Cart, Restaurant, User } from '../../../../domain/entities';
import { OrderResponseDto } from '../../dto';
import { CreateOrderCommand } from '../index';
export declare class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
    private readonly cartRepository;
    private readonly userRepository;
    private readonly restaurantRepository;
    private readonly dataSource;
    constructor(cartRepository: Repository<Cart>, userRepository: Repository<User>, restaurantRepository: Repository<Restaurant>, dataSource: DataSource);
    execute(command: CreateOrderCommand): Promise<OrderResponseDto>;
}
