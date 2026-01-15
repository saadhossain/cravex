import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';
import {
  AdminOrdersQueryDto,
  DashboardStatsDto,
  OrdersByStatusDto,
  RecentOrderDto,
  RevenueByDayDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    // Get total orders
    const totalOrders = await this.orderRepository.count();

    // Get total revenue
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .getRawOne();
    const totalRevenue = parseFloat(revenueResult?.total || '0');

    // Get total restaurants
    const totalRestaurants = await this.restaurantRepository.count({
      where: { isActive: true },
    });

    // Get total customers
    const totalCustomers = await this.userRepository.count({
      where: { role: 'customer' },
    });

    // Get pending orders count
    const pendingOrders = await this.orderRepository.count({
      where: { status: 'pending' },
    });

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get orders by status
    const ordersByStatus = await this.getOrdersByStatus();

    // Get revenue by day (last 7 days)
    const revenueByDay = await this.getRevenueByDay();

    // Get recent orders
    const recentOrders = await this.getRecentOrders();

    return {
      totalOrders,
      totalRevenue,
      totalRestaurants,
      totalCustomers,
      pendingOrders,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      ordersByStatus,
      revenueByDay,
      recentOrders,
    };
  }

  private async getOrdersByStatus(): Promise<OrdersByStatusDto> {
    const statuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ] as const;

    const counts: Record<string, number> = {};
    for (const status of statuses) {
      counts[status] = await this.orderRepository.count({ where: { status } });
    }

    return {
      pending: counts.pending || 0,
      confirmed: counts.confirmed || 0,
      preparing: counts.preparing || 0,
      ready: counts.ready || 0,
      out_for_delivery: counts.out_for_delivery || 0,
      delivered: counts.delivered || 0,
      cancelled: counts.cancelled || 0,
    };
  }

  private async getRevenueByDay(): Promise<RevenueByDayDto[]> {
    const days = 7;
    const result: RevenueByDayDto[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayStats = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'revenue')
        .addSelect('COUNT(order.id)', 'orders')
        .where('order.createdAt >= :start', { start: date })
        .andWhere('order.createdAt < :end', { end: nextDate })
        .andWhere('order.status != :cancelled', { cancelled: 'cancelled' })
        .getRawOne();

      result.push({
        date: date.toISOString().split('T')[0],
        revenue: parseFloat(dayStats?.revenue || '0'),
        orders: parseInt(dayStats?.orders || '0', 10),
      });
    }

    return result;
  }

  private async getRecentOrders(): Promise<RecentOrderDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['restaurant', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: parseFloat(order.total.toString()),
      restaurantName: order.restaurant?.name || 'Unknown',
      customerName: order.user
        ? `${order.user.firstName} ${order.user.lastName}`
        : 'Guest',
      deliveryType: order.deliveryType,
      createdAt: order.createdAt,
    }));
  }

  async getOrders(query: AdminOrdersQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      restaurantId,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.user', 'user');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (restaurantId) {
      queryBuilder.andWhere('order.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (minAmount !== undefined) {
      queryBuilder.andWhere('order.total >= :minAmount', { minAmount });
    }

    if (maxAmount !== undefined) {
      queryBuilder.andWhere('order.total <= :maxAmount', { maxAmount });
    }

    if (startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('order.createdAt <= :endDate', { endDate: end });
    }

    if (search) {
      queryBuilder.andWhere(
        '(order.orderNumber ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    const validSortFields = ['createdAt', 'total', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`order.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      data: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: parseFloat(order.total.toString()),
        subtotal: parseFloat(order.subtotal.toString()),
        deliveryFee: parseFloat(order.deliveryFee.toString()),
        discount: parseFloat(order.discount.toString()),
        restaurantName: order.restaurant?.name || 'Unknown',
        restaurantId: order.restaurantId,
        customerName: order.user
          ? `${order.user.firstName} ${order.user.lastName}`
          : 'Guest',
        customerId: order.userId,
        deliveryType: order.deliveryType,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRestaurantsForFilter() {
    const restaurants = await this.restaurantRepository.find({
      where: { isActive: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    return restaurants;
  }
}
