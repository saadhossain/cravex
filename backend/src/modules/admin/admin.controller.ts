import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AdminService } from './admin.service';
import {
  AdminOrdersQueryDto,
  DashboardStatsDto,
  PeriodQueryDto,
  TopSellingDishesResponseDto,
} from './dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics for superadmin' })
  async getDashboardStats(
    @Query() query: PeriodQueryDto,
  ): Promise<DashboardStatsDto> {
    return this.adminService.getDashboardStats(query.period);
  }

  @Get('dashboard/top-selling-dishes')
  @ApiOperation({ summary: 'Get top selling dishes' })
  async getTopSellingDishes(
    @Query() query: PeriodQueryDto,
  ): Promise<TopSellingDishesResponseDto> {
    return this.adminService.getTopSellingDishes(query.period);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders with filtering for superadmin' })
  async getOrders(@Query() query: AdminOrdersQueryDto) {
    return this.adminService.getOrders(query);
  }

  @Get('restaurants/list')
  @ApiOperation({ summary: 'Get restaurants list for filter dropdown' })
  async getRestaurantsForFilter() {
    return this.adminService.getRestaurantsForFilter();
  }
}
