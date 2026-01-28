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
import { CreateRestaurantCommand, UpdateRestaurantCommand } from './commands';
import {
  AdminRestaurantsQueryDto,
  CreateAdminRestaurantDto,
  CreateRestaurantDto,
  PaginatedResponseDto,
  RestaurantDetailDto,
  RestaurantListQueryDto,
  RestaurantResponseDto,
  UpdateAdminRestaurantDto,
  UpdateRestaurantDto,
} from './dto';
import { GetRestaurantBySlugQuery, GetRestaurantsQuery } from './queries';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly restaurantService: RestaurantService,
  ) {}

  // ============ Public/User Endpoints ============

  @Get()
  @ApiOperation({ summary: 'Get all restaurants with pagination' })
  async findAll(
    @Query() query: RestaurantListQueryDto,
  ): Promise<PaginatedResponseDto<RestaurantResponseDto>> {
    return this.queryBus.execute(new GetRestaurantsQuery(query));
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get restaurant by slug' })
  async findOne(@Param('slug') slug: string): Promise<RestaurantDetailDto> {
    return this.queryBus.execute(new GetRestaurantBySlugQuery(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a restaurant (for restaurant owners)' })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.commandBus.execute(new CreateRestaurantCommand(user.id, dto));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.commandBus.execute(
      new UpdateRestaurantCommand(id, user.id, dto),
    );
  }

  // ============ Public Home Page Endpoints ============

  @Get('public/popular')
  @ApiOperation({ summary: 'Get popular restaurants for home page' })
  async getPopularRestaurants(@Query('limit') limit?: number) {
    return this.restaurantService.getPopularRestaurants(limit || 8);
  }

  @Get('public/featured')
  @ApiOperation({ summary: 'Get featured restaurants for home page' })
  async getFeaturedRestaurants(@Query('limit') limit?: number) {
    return this.restaurantService.getFeaturedRestaurants(limit || 4);
  }

  // ============ Admin/Superadmin Endpoints ============

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurants list for filter dropdown (admin)' })
  async getRestaurantsForFilter() {
    return this.restaurantService.getRestaurantsForFilter();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restaurants with filtering (admin)' })
  async getRestaurantsAdmin(@Query() query: AdminRestaurantsQueryDto) {
    return this.restaurantService.getRestaurantsAdmin(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a restaurant with owner (admin)' })
  async createRestaurantAdmin(@Body() dto: CreateAdminRestaurantDto) {
    return this.restaurantService.createRestaurantAdmin(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant (admin)' })
  async updateRestaurantAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurantAdmin(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant (admin)' })
  async deleteRestaurant(@Param('id') id: string) {
    return this.restaurantService.deleteRestaurant(id);
  }
}
