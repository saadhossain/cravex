import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant, User } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';
import { RestaurantController } from './restaurant.controller';

import {
  CreateRestaurantHandler,
  UpdateRestaurantHandler,
} from './commands/handlers';
import {
  GetRestaurantByIdHandler,
  GetRestaurantBySlugHandler,
  GetRestaurantsHandler,
} from './queries/handlers';

export const CommandHandlers = [
  CreateRestaurantHandler,
  UpdateRestaurantHandler,
];

export const QueryHandlers = [
  GetRestaurantsHandler,
  GetRestaurantBySlugHandler,
  GetRestaurantByIdHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Restaurant, User]),
    AuthModule,
  ],
  controllers: [RestaurantController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [],
})
export class RestaurantModule {}
