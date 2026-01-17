import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { Order } from '../../domain/entities/order.entity';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';
import {
  AdminDishesQueryDto,
  AdminOrdersQueryDto,
  AdminRestaurantsQueryDto,
  DashboardStatsDto,
  OrdersByStatusDto,
  RecentOrderDto,
  RevenueByDayDto,
  TopSellingDishDto,
  TopSellingDishesResponseDto,
} from './dto';

type Period = 'daily' | 'weekly' | 'monthly';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getDateRange(period?: Period): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    switch (period) {
      case 'daily':
        // Today
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setDate(start.getDate() - 30);
        break;
      default:
        // Default to all time - set start to earliest possible date
        start.setFullYear(2000, 0, 1);
    }

    return { start, end };
  }

  private getPreviousPeriodRange(period?: Period): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    switch (period) {
      case 'daily':
        // Yesterday
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        // Previous week
        start.setDate(start.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 7);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        // Previous month
        start.setDate(start.getDate() - 60);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 30);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start.setFullYear(2000, 0, 1);
        end.setFullYear(2000, 0, 1);
    }

    return { start, end };
  }

  async getDashboardStats(period?: Period): Promise<DashboardStatsDto> {
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
    const revenueByDay = await this.getRevenueByDay(period);

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

  private async getRevenueByDay(period?: Period): Promise<RevenueByDayDto[]> {
    let days = 7;
    if (period === 'monthly') {
      days = 30;
    } else if (period === 'daily') {
      days = 1;
    }

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

  async getTopSellingDishes(
    period?: Period,
  ): Promise<TopSellingDishesResponseDto> {
    const { start, end } = this.getDateRange(period);
    const previousRange = this.getPreviousPeriodRange(period);

    // Get top selling dishes in current period
    const topDishes = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.menuItem', 'menuItem')
      .select('orderItem.menuItemId', 'menuItemId')
      .addSelect('menuItem.name', 'name')
      .addSelect('menuItem.imageUrl', 'image')
      .addSelect('menuItem.price', 'price')
      .addSelect('SUM(orderItem.quantity)', 'orderCount')
      .where('order.createdAt >= :start', { start })
      .andWhere('order.createdAt <= :end', { end })
      .andWhere('order.status != :cancelled', { cancelled: 'cancelled' })
      .groupBy('orderItem.menuItemId')
      .addGroupBy('menuItem.name')
      .addGroupBy('menuItem.imageUrl')
      .addGroupBy('menuItem.price')
      .orderBy('SUM(orderItem.quantity)', 'DESC')
      .limit(5)
      .getRawMany();

    // Get overall order counts for comparison
    const currentPeriodOrders = await this.orderRepository.count({
      where: {
        createdAt: MoreThanOrEqual(start),
      },
    });

    const previousPeriodOrders = await this.orderRepository.count({
      where: {
        createdAt: MoreThanOrEqual(previousRange.start),
      },
    });

    // Calculate overall rate
    const overallChange =
      previousPeriodOrders > 0
        ? ((currentPeriodOrders - previousPeriodOrders) /
            previousPeriodOrders) *
          100
        : currentPeriodOrders > 0
          ? 100
          : 0;

    // Get previous period order counts for each dish to calculate rate
    const dishes: TopSellingDishDto[] = await Promise.all(
      topDishes.map(async (dish) => {
        // Get previous period count for this dish
        const previousCount = await this.orderItemRepository
          .createQueryBuilder('orderItem')
          .leftJoin('orderItem.order', 'order')
          .where('orderItem.menuItemId = :menuItemId', {
            menuItemId: dish.menuItemId,
          })
          .andWhere('order.createdAt >= :start', { start: previousRange.start })
          .andWhere('order.createdAt <= :end', { end: previousRange.end })
          .andWhere('order.status != :cancelled', { cancelled: 'cancelled' })
          .select('SUM(orderItem.quantity)', 'count')
          .getRawOne();

        const currentCount = parseInt(dish.orderCount || '0', 10);
        const prevCount = parseInt(previousCount?.count || '0', 10);

        const rate =
          prevCount > 0
            ? ((currentCount - prevCount) / prevCount) * 100
            : currentCount > 0
              ? 100
              : 0;

        return {
          id: dish.menuItemId,
          name: dish.name || 'Unknown Dish',
          image: dish.image,
          price: parseFloat(dish.price || '0'),
          orderCount: currentCount,
          orderRate: Math.abs(Math.round(rate)),
          isPositive: rate >= 0,
        };
      }),
    );

    return {
      dishes,
      overallRate: {
        value: Math.abs(Math.round(overallChange)),
        isPositive: overallChange >= 0,
      },
    };
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

  async getRestaurants(query: AdminRestaurantsQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder =
      this.restaurantRepository.createQueryBuilder('restaurant');

    if (search) {
      queryBuilder.andWhere('restaurant.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('restaurant.isActive = :isActive', { isActive });
    }

    // Sorting
    const validSortFields = ['createdAt', 'name', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`restaurant.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [restaurants, total] = await queryBuilder.getManyAndCount();

    return {
      data: restaurants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDishes(query: AdminDishesQueryDto) {
    console.log('getDishes called with query:', query);
    const {
      page = 1,
      limit = 10,
      search,
      restaurantId,
      categoryId,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.menuItemRepository
      .createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.category', 'category')
      .leftJoinAndSelect('category.restaurant', 'restaurant');

    if (search) {
      queryBuilder.andWhere(
        '(menuItem.name ILIKE :search OR menuItem.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (restaurantId) {
      queryBuilder.andWhere('category.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('menuItem.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('menuItem.isAvailable = :isAvailable', {
        isAvailable,
      });
    }

    // Sorting
    const validSortFields = ['createdAt', 'name', 'price', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`menuItem.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [dishes, total] = await queryBuilder.getManyAndCount();
    console.log(`Found ${total} dishes`);
    if (dishes.length > 0) {
      console.log('Sample dish category:', dishes[0].category);
    }

    const mappedDishes = dishes.map((dish) => ({
      ...dish,
      restaurant: dish.category?.restaurant,
      restaurantId: dish.category?.restaurantId,
    }));

    return {
      data: mappedDishes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUsers(query: AdminUsersQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    // Sorting
    const validSortFields = ['createdAt', 'firstName', 'lastName', 'email'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`user.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => {
        const { password, refreshToken, ...result } = user;
        return result;
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    await this.userRepository.save(user);

    // If user is a restaurant owner, we might want to update restaurant status too
    // But requirement says only activate new registrant restaurant.
    if (user.role === 'restaurant') {
      const restaurant = await this.restaurantRepository.findOne({
        where: { ownerId: user.id },
      });
      if (restaurant) {
        restaurant.isActive = isActive;
        await this.restaurantRepository.save(restaurant);
      }
    }

    return { message: 'User status updated successfully' };
  }
}
