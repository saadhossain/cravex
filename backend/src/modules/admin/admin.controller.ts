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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AdminService } from './admin.service';
import {
  AdminCouponsQueryDto,
  AdminDishesQueryDto,
  AdminOrdersQueryDto,
  AdminRestaurantsQueryDto,
  AdminUsersQueryDto,
  CreateAdminOrderDto,
  CreateCouponDto,
  DashboardStatsDto,
  PeriodQueryDto,
  TopSellingDishesResponseDto,
  UpdateUserStatusDto,
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

  @Post('orders')
  @ApiOperation({ summary: 'Create a new order for a user' })
  async createOrder(@Body() createOrderDto: CreateAdminOrderDto) {
    return this.adminService.createOrder(createOrderDto);
  }

  @Get('restaurants')
  @ApiOperation({
    summary: 'Get all restaurants with filtering for superadmin',
  })
  async getRestaurants(@Query() query: AdminRestaurantsQueryDto) {
    return this.adminService.getRestaurants(query);
  }

  @Get('restaurants/list')
  @ApiOperation({ summary: 'Get restaurants list for filter dropdown' })
  async getRestaurantsForFilter() {
    return this.adminService.getRestaurantsForFilter();
  }

  @Get('dishes')
  @ApiOperation({ summary: 'Get all dishes with filtering for superadmin' })
  async getDishes(@Query() query: AdminDishesQueryDto) {
    return this.adminService.getDishes(query);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with filtering for superadmin' })
  async getUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (activate/deactivate)' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateStatusDto.isActive);
  }

  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons with filtering for superadmin' })
  async getCoupons(@Query() query: AdminCouponsQueryDto) {
    return this.adminService.getCoupons(query);
  }

  @Post('coupons')
  @ApiOperation({ summary: 'Create a new coupon' })
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.adminService.createCoupon(createCouponDto);
  }

  @Patch('coupons/:id')
  @ApiOperation({ summary: 'Update a coupon' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponDto: CreateCouponDto,
  ) {
    return this.adminService.updateCoupon(id, updateCouponDto);
  }

  @Delete('coupons/:id')
  @ApiOperation({ summary: 'Delete a coupon' })
  async deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(id);
  }
}
