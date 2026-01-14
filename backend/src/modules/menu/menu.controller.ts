import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CurrentUser, Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CreateCategoryCommand, CreateMenuItemCommand } from './commands';
import {
  CategoryWithItemsDto,
  CreateCategoryDto,
  CreateMenuItemDto,
} from './dto';
import { GetMenuByRestaurantQuery } from './queries';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  async createCategory(
    @CurrentUser() user: User,
    @Body() dto: CreateCategoryDto,
  ) {
    // Controller trusts handler to verify ownership via ownerId
    return this.commandBus.execute(new CreateCategoryCommand(user.id, dto));
  }

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  async createMenuItem(
    @CurrentUser() user: User,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.commandBus.execute(new CreateMenuItemCommand(user.id, dto));
  }

  @Get(':restaurantId')
  async getMenu(
    @Param('restaurantId') restaurantId: string,
  ): Promise<CategoryWithItemsDto[]> {
    return this.queryBus.execute(new GetMenuByRestaurantQuery(restaurantId));
  }
}
