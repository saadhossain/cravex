import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  MenuItem,
  MenuOption,
  MenuOptionGroup,
  Restaurant,
} from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';
import { MenuController } from './menu.controller';

import {
  CreateCategoryHandler,
  CreateMenuItemHandler,
} from './commands/handlers';
import { GetMenuByRestaurantHandler } from './queries/handlers';

export const CommandHandlers = [CreateCategoryHandler, CreateMenuItemHandler];

export const QueryHandlers = [GetMenuByRestaurantHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Category,
      MenuItem,
      Restaurant,
      MenuOptionGroup,
      MenuOption,
    ]),
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class MenuModule {}
