import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  AdminCategoriesQueryDto,
  AdminDishesQueryDto,
  CategoryWithItemsDto,
  CreateAdminCategoryDto,
  CreateAdminDishDto,
  CreateCategoryDto,
  CreateMenuItemDto,
  UpdateAdminCategoryDto,
  UpdateAdminDishDto,
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

  // ============ Admin/Superadmin Category Endpoints ============

  @Get('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories with filtering (admin)' })
  async getCategoriesAdmin(@Query() query: AdminCategoriesQueryDto) {
    return this.menuService.getCategoriesAdmin(query);
  }

  @Get('admin/categories/restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get categories for a restaurant (admin)' })
  async getCategoriesForRestaurant(
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.menuService.getCategoriesForRestaurant(restaurantId);
  }

  @Get('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a category by ID (admin)' })
  async getCategoryById(@Param('id') id: string) {
    return this.menuService.getCategoryById(id);
  }

  @Post('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category (admin)' })
  async createCategoryAdmin(@Body() dto: CreateAdminCategoryDto) {
    return this.menuService.createCategoryAdmin(dto);
  }

  @Patch('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (admin)' })
  async updateCategoryAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminCategoryDto,
  ) {
    return this.menuService.updateCategoryAdmin(id, dto);
  }

  @Delete('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (admin)' })
  async deleteCategoryAdmin(@Param('id') id: string) {
    return this.menuService.deleteCategoryAdmin(id);
  }

  // ============ Admin/Superadmin Dish Endpoints ============

  @Get('admin/dishes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all dishes with filtering (admin)' })
  async getDishesAdmin(@Query() query: AdminDishesQueryDto) {
    return this.menuService.getDishesAdmin(query);
  }

  @Get('admin/dishes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a dish by ID (admin)' })
  async getDishById(@Param('id') id: string) {
    return this.menuService.getDishById(id);
  }

  @Post('admin/dishes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a dish (admin)' })
  async createDishAdmin(@Body() dto: CreateAdminDishDto) {
    return this.menuService.createDishAdmin(dto);
  }

  @Patch('admin/dishes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a dish (admin)' })
  async updateDishAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDishDto,
  ) {
    return this.menuService.updateDishAdmin(id, dto);
  }

  @Delete('admin/dishes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a dish (admin)' })
  async deleteDishAdmin(@Param('id') id: string) {
    return this.menuService.deleteDishAdmin(id);
  }
}
