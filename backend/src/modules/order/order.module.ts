import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartItem,
  MenuItem,
  OrderItem,
  OrderItemOption,
  Restaurant,
  User,
} from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from 'src/domain/entities/order.entity';
import { CreateOrderHandler } from './commands/handlers';
import { GetOrderDetailHandler, GetOrdersHandler } from './queries/handlers';

export const CommandHandlers = [CreateOrderHandler];

export const QueryHandlers = [GetOrdersHandler, GetOrderDetailHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderItemOption,
      Cart,
      CartItem,
      User,
      Restaurant,
      MenuItem,
    ]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ...CommandHandlers, ...QueryHandlers],
})
export class OrderModule {}
