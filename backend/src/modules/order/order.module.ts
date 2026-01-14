import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartItem,
  OrderItem,
  OrderItemOption,
  Restaurant,
  User,
} from '../../domain/entities'; // Cart needed for Checkout
import { AuthModule } from '../auth/auth.module';
import { OrderController } from './order.controller';

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
    ]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class OrderModule {}
