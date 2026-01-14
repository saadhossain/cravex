import { IQueryHandler } from '@nestjs/cqrs';
import { Order } from 'src/domain/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderResponseDto } from '../../dto';
import { GetOrderDetailQuery, GetOrdersQuery } from '../index';
export declare class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    execute(query: GetOrdersQuery): Promise<OrderResponseDto[]>;
}
export declare class GetOrderDetailHandler implements IQueryHandler<GetOrderDetailQuery> {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    execute(query: GetOrderDetailQuery): Promise<OrderResponseDto>;
}
