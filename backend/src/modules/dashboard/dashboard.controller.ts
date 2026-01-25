import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { DashboardService } from './dashboard.service';
import {
  DashboardStatsDto,
  PeriodQueryDto,
  TopSellingDishesResponseDto,
} from './dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics for superadmin' })
  async getDashboardStats(
    @Query() query: PeriodQueryDto,
  ): Promise<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats(query.period);
  }

  @Get('top-selling-dishes')
  @ApiOperation({ summary: 'Get top selling dishes' })
  async getTopSellingDishes(
    @Query() query: PeriodQueryDto,
  ): Promise<TopSellingDishesResponseDto> {
    return this.dashboardService.getTopSellingDishes(query.period);
  }
}
