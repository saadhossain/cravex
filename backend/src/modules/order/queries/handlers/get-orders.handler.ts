import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/domain/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderResponseDto } from '../../dto';
import { GetOrderDetailQuery, GetOrdersQuery } from '../index';

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(query: GetOrdersQuery): Promise<OrderResponseDto[]> {
    const { userId } = query;

    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['restaurant', 'items'], // Minimal relations for list? Or full?
      // Plan asks for "My Orders" - usually summary.
      // But DTO is full. I'll include enough.
      order: { createdAt: 'DESC' },
    });

    return orders.map(OrderResponseDto.fromEntity);
  }
}

@QueryHandler(GetOrderDetailQuery)
export class GetOrderDetailHandler implements IQueryHandler<GetOrderDetailQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(query: GetOrderDetailQuery): Promise<OrderResponseDto> {
    const { userId, orderId } = query;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['restaurant', 'items', 'items.selectedOptions'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not own this order');
    }

    return OrderResponseDto.fromEntity(order);
  }
}
