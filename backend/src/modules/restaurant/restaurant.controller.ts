import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CurrentUser, Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CreateRestaurantCommand, UpdateRestaurantCommand } from './commands';
import {
  CreateRestaurantDto,
  PaginatedResponseDto,
  RestaurantDetailDto,
  RestaurantListQueryDto,
  RestaurantResponseDto,
  UpdateRestaurantDto,
} from './dto';
import { GetRestaurantBySlugQuery, GetRestaurantsQuery } from './queries';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin') // Only restaurant owners or admins can create
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    // If superadmin, they might specify ownerId in dto (not implemented yet),
    // for now we assume the creator is the owner
    return this.commandBus.execute(new CreateRestaurantCommand(user.id, dto));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant', 'superadmin')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.commandBus.execute(
      new UpdateRestaurantCommand(id, user.id, dto),
    );
  }

  @Get()
  async findAll(
    @Query() query: RestaurantListQueryDto,
  ): Promise<PaginatedResponseDto<RestaurantResponseDto>> {
    return this.queryBus.execute(new GetRestaurantsQuery(query));
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<RestaurantDetailDto> {
    return this.queryBus.execute(new GetRestaurantBySlugQuery(slug));
  }
}
