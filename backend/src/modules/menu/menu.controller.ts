import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../domain/entities';
import { CurrentUser, Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CreateCategoryCommand, CreateMenuItemCommand } from './commands';
import {
  AdminDishesQueryDto,
  CategoryWithItemsDto,
  CreateCategoryDto,
  CreateMenuItemDto,
} from './dto';
import { MenuService } from './menu.service';
import { GetMenuByRestaurantQuery } from './queries';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly menuService: MenuService,
  ) {}

  // ============ User/Restaurant Endpoints ============

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category' })
  async createCategory(
    @CurrentUser() user: User,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.commandBus.execute(new CreateCategoryCommand(user.id, dto));
  }

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a menu item' })
  async createMenuItem(
    @CurrentUser() user: User,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.commandBus.execute(new CreateMenuItemCommand(user.id, dto));
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get menu by restaurant ID' })
  async getMenu(
    @Param('restaurantId') restaurantId: string,
  ): Promise<CategoryWithItemsDto[]> {
    return this.queryBus.execute(new GetMenuByRestaurantQuery(restaurantId));
  }

  // ============ Admin/Superadmin Endpoints ============

  @Get('admin/dishes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all dishes with filtering (admin)' })
  async getDishesAdmin(@Query() query: AdminDishesQueryDto) {
    return this.menuService.getDishesAdmin(query);
  }
}
