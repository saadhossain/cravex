import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { CreateOrderCommand } from './commands';
import { CreateOrderDto, OrderResponseDto } from './dto';
import { GetOrderDetailQuery, GetOrdersQuery } from './queries';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createOrder(
    @CurrentUser() user: User,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.commandBus.execute(new CreateOrderCommand(user.id, dto));
  }

  @Get()
  async getOrders(@CurrentUser() user: User): Promise<OrderResponseDto[]> {
    return this.queryBus.execute(new GetOrdersQuery(user.id));
  }

  @Get(':id')
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<OrderResponseDto> {
    return this.queryBus.execute(new GetOrderDetailQuery(user.id, id));
  }
}
