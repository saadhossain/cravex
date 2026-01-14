import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartItem,
  CartItemOption,
  MenuItem,
  MenuOption,
  Restaurant,
} from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';
import { CartController } from './cart.controller';

import {
  AddToCartHandler,
  RemoveCartItemHandler,
  UpdateCartItemHandler,
} from './commands/handlers';
import { GetCartHandler } from './queries/handlers';

export const CommandHandlers = [
  AddToCartHandler,
  UpdateCartItemHandler,
  RemoveCartItemHandler,
];

export const QueryHandlers = [GetCartHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      CartItemOption,
      MenuItem,
      Restaurant, // Needed for validation in add-to-cart
      MenuOption,
    ]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class CartModule {}
