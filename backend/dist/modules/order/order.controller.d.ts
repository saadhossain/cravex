import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CreateOrderDto, OrderResponseDto } from './dto';
export declare class OrderController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createOrder(user: User, dto: CreateOrderDto): Promise<OrderResponseDto>;
    getOrders(user: User): Promise<OrderResponseDto[]>;
    getOrder(id: string, user: User): Promise<OrderResponseDto>;
}
