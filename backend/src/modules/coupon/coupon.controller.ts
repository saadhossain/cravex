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
import { CouponService } from './coupon.service';
import { AdminCouponsQueryDto, CreateCouponDto } from './dto';

@ApiTags('Coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
@ApiBearerAuth()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all coupons with filtering (admin)' })
  async getCouponsAdmin(@Query() query: AdminCouponsQueryDto) {
    return this.couponService.getCouponsAdmin(query);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Create a new coupon (admin)' })
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Patch('admin/:id')
  @ApiOperation({ summary: 'Update a coupon (admin)' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponDto: CreateCouponDto,
  ) {
    return this.couponService.updateCoupon(id, updateCouponDto);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete a coupon (admin)' })
  async deleteCoupon(@Param('id') id: string) {
    return this.couponService.deleteCoupon(id);
  }
}
