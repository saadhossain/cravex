import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Coupon } from '../../domain/entities/coupon.entity';
import { AdminCouponsQueryDto, CreateCouponDto } from './dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async getCouponsAdmin(query: AdminCouponsQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      restaurantId,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Coupon> = {};

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const validSortFields = ['createdAt', 'code', 'validTo', 'usageCount'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [coupons, total] = await this.couponRepository.findAndCount({
      where,
      relations: ['restaurant', 'menuItem'],
      order: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        code: true,
        discountValue: true,
        discountType: true,
        minimumOrder: true,
        maxDiscount: true,
        usageCount: true,
        maxUsageCount: true,
        isActive: true,
        validFrom: true,
        validTo: true,
        createdAt: true,
        restaurantId: true,
        menuItemId: true,
        restaurant: {
          id: true,
          name: true,
        },
      },
    });

    return {
      data: coupons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createCoupon(createCouponDto: CreateCouponDto) {
    const coupon = this.couponRepository.create(createCouponDto);
    return this.couponRepository.save(coupon);
  }

  async updateCoupon(id: string, updateCouponDto: CreateCouponDto) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = this.couponRepository.merge(coupon, updateCouponDto);

    if (!updateCouponDto.restaurantId) {
      updatedCoupon.restaurant = null as any;
      updatedCoupon.restaurantId = null as any;
    }
    if (!updateCouponDto.menuItemId) {
      updatedCoupon.menuItem = null as any;
      updatedCoupon.menuItemId = null as any;
    }

    return this.couponRepository.save(updatedCoupon);
  }

  async deleteCoupon(id: string) {
    const result = await this.couponRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Coupon not found');
    }
    return { message: 'Coupon deleted successfully' };
  }
}
