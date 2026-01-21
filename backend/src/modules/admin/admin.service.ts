import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  DataSource,
  FindOptionsWhere,
  ILike,
  In,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Coupon } from '../../domain/entities/coupon.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { Order } from '../../domain/entities/order.entity';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';
import {
  AdminCouponsQueryDto,
  AdminDishesQueryDto,
  AdminOrdersQueryDto,
  AdminRestaurantsQueryDto,
  AdminUsersQueryDto,
  CreateAdminOrderDto,
  CreateAdminRestaurantDto,
  CreateCouponDto,
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
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    private readonly dataSource: DataSource,
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

    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner');

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
      data: restaurants.map((r) => {
        if (r.owner) {
          const { password, refreshToken, ...ownerWithoutPassword } = r.owner;
          r.owner = ownerWithoutPassword as any;
        }
        return r;
      }),
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
    console.log('getUsers called with query:', query);
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      if (search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Always exclude superadmin from the list
      // Note: Assuming 'superadmin' is the value in the DB enum
      queryBuilder.andWhere("user.role != 'superadmin'");

      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive });
      }

      console.log(queryBuilder.getSql(), queryBuilder.getParameters());

      // Sorting
      const validSortFields = ['createdAt', 'firstName', 'lastName', 'email'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      queryBuilder.orderBy(`user.${sortField}`, sortOrder);

      // Pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [users, total] = await queryBuilder.getManyAndCount();
      console.log(`Found ${total} users`);
      if (users.length > 0) {
        console.log('First user:', users[0]);
      } else {
        console.log('No users found with detailed query');
      }

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
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
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

  async getCoupons(query: AdminCouponsQueryDto) {
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

    // Validate sort field
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

    // Explicitly handle fields that might be cleared
    const updatedCoupon = this.couponRepository.merge(coupon, updateCouponDto);

    // Handle relations if they are null in DTO but present in DB (clearing them)
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
  async createOrder(createOrderDto: CreateAdminOrderDto) {
    const { userId, restaurantId, items, deliveryType, paymentMethod, note } =
      createOrderDto;

    // 1. Verify IDs
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // 2. Fetch dishes to get Prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await this.menuItemRepository.findBy({
      id: In(menuItemIds),
    });

    if (dbMenuItems.length !== items.length) {
      throw new NotFoundException('One or more menu items not found');
    }

    const menuItemMap = new Map(dbMenuItems.map((i) => [i.id, i]));

    // 3. Calculate Totals
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const dbItem = menuItemMap.get(item.menuItemId);
      if (!dbItem) continue;

      const price = Number(dbItem.price);
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        menuItemName: dbItem.name,
        menuItemId: dbItem.id,
        price,
        quantity: item.quantity,
        totalPrice: lineTotal,
      });
    }

    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
      deliveryFee = Number(restaurant.deliveryFee || 0);
      const minDelivery = Number(restaurant.minimumDelivery || 0);
      if (subtotal < minDelivery) {
        throw new Error(`Minimum order amount is ${minDelivery}`);
      }
    }

    const total = subtotal + deliveryFee;

    // 4. Transaction to Save
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        userId,
        restaurantId,
        status: 'pending',
        total,
        subtotal,
        deliveryFee,
        discount: 0,
        deliveryType,
        paymentMethod,
        paymentStatus: createOrderDto.paymentStatus || 'pending',
        specialInstructions: note,
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
          Math.random() * 1000,
        )}`,
      });

      const savedOrder = await queryRunner.manager.save(order);

      for (const itemData of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          menuItemName: itemData.menuItemName,
          menuItemId: itemData.menuItemId,
          unitPrice: itemData.price,
          quantity: itemData.quantity,
          totalPrice: itemData.totalPrice,
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();

      return { message: 'Order created successfully', orderId: savedOrder.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrder(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['restaurant', 'user', 'items', 'items.menuItem'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrder(id: string, updateOrderDto: any) {
    // Note: using any for DTO temporarily to avoid import loops if strict typing issues,
    // but ideally use UpdateAdminOrderDto.
    const {
      userId,
      restaurantId,
      items,
      deliveryType,
      paymentMethod,
      paymentStatus,
      note,
      status, // Allow status update
    } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['restaurant', 'items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Update basic fields if provided
      if (userId) order.userId = userId;
      if (restaurantId) order.restaurantId = restaurantId;
      if (deliveryType) order.deliveryType = deliveryType;
      if (paymentMethod) order.paymentMethod = paymentMethod;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (note !== undefined) order.specialInstructions = note;
      if (status) order.status = status;

      // 2. Handle Items Update (Full Replacement if items array is provided)
      if (items && items.length > 0) {
        // We need to fetch menu items to recalculate totals
        const menuItemIds = items.map((i: any) => i.menuItemId);
        const dbMenuItems = await this.menuItemRepository.findBy({
          id: In(menuItemIds),
        });

        const menuItemMap = new Map(dbMenuItems.map((i) => [i.id, i]));
        let subtotal = 0;
        const newOrderItems: OrderItem[] = [];

        // Delete existing items
        await queryRunner.manager.delete(OrderItem, { orderId: id });

        for (const item of items) {
          const dbItem = menuItemMap.get(item.menuItemId);
          // If item not found (maybe deleted?), skip or throw. Let's skip safely.
          if (!dbItem) continue;

          const price = Number(dbItem.price);
          const lineTotal = price * item.quantity;
          subtotal += lineTotal;

          const orderItem = queryRunner.manager.create(OrderItem, {
            order: order, // Pass the order entity to establish relation
            menuItemName: dbItem.name,
            menuItemId: dbItem.id,
            unitPrice: price,
            quantity: item.quantity,
            totalPrice: lineTotal,
          });
          newOrderItems.push(orderItem);
        }

        order.subtotal = subtotal;

        // Recalculate delivery fee if type/restaurant changed or subtotal changed
        // Use provided restaurantId or existing order.restaurantId
        const activeRestaurantId = restaurantId || order.restaurantId;
        const activeDeliveryType = deliveryType || order.deliveryType;

        let restaurant = order.restaurant;
        if (restaurantId && restaurantId !== order.restaurantId) {
          restaurant = (await this.restaurantRepository.findOne({
            where: { id: restaurantId },
          })) as Restaurant;
        }

        let deliveryFee = 0;
        if (activeDeliveryType === 'delivery' && restaurant) {
          deliveryFee = Number(restaurant.deliveryFee || 0);
          const minDelivery = Number(restaurant.minimumDelivery || 0);
          // Optional: enforce min delivery on update? Probably yes.
          if (subtotal < minDelivery) {
            throw new Error(`Minimum order amount is ${minDelivery}`);
          }
        }
        order.deliveryFee = deliveryFee;
        order.total = subtotal + deliveryFee - (Number(order.discount) || 0);

        // Update items relation to new items so TypeORM knows about them
        // and doesn't try to mess with the old deleted ones that were in memory
        order.items = newOrderItems;

        // No need to manually save newItems because cascade: true,
        // saving 'order' will save 'items'
      } else if (items && items.length === 0) {
        // Clear items?
        throw new Error('Order must have at least one item');
      }

      // If only status/payment changed, no need to recalc totals unless we want to be super safe.
      // But if items changed, we already updated totals above.

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return { message: 'Order updated successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(Math.random() * 10000)
    );
  }

  async createRestaurant(dto: CreateAdminRestaurantDto) {
    const { ownerId, newOwner, ...restaurantData } = dto;

    let owner: User;

    if (newOwner) {
      // Check if user exists
      const existingUser = await this.userRepository.findOne({
        where: { email: newOwner.email },
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(newOwner.password, 10);

      owner = this.userRepository.create({
        email: newOwner.email,
        password: hashedPassword,
        firstName: newOwner.firstName,
        lastName: newOwner.lastName,
        phone: newOwner.phone,
        role: 'restaurant',
        isActive: true, // Auto activate? Or wait for email verification?
        isEmailVerified: true, // Assuming admin created means verified
      });

      await this.userRepository.save(owner);
    } else if (ownerId) {
      const foundOwner = await this.userRepository.findOne({
        where: { id: ownerId },
      });
      if (!foundOwner) {
        throw new NotFoundException('Owner not found');
      }
      owner = foundOwner;

      if (owner.role !== 'superadmin' && owner.role !== 'restaurant') {
        owner.role = 'restaurant';
        await this.userRepository.save(owner);
      }
    } else {
      throw new Error('Either ownerId or newOwner must be provided');
    }

    const restaurant = this.restaurantRepository.create({
      ...restaurantData,
      owner,
      ownerId: owner.id,
      slug: this.generateSlug(dto.name),
      isActive: true,
      latitude: dto.latitude,
      longitude: dto.longitude,
      logoUrl: dto.logoUrl,
    });

    return this.restaurantRepository.save(restaurant);
  }

  async updateRestaurant(id: string, dto: Partial<CreateAdminRestaurantDto>) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const { ownerId, newOwner, ...updateData } = dto;

    // Handle owner update if provided (only if not readonly logic applied in frontend, but backend should support it if sent)
    // However, user requirement says admin info won't be changeable.
    // So we might ignore ownerId/newOwner updates here or handle them if we want to be flexible.
    // For now, let's just update restaurant fields.

    Object.assign(restaurant, updateData);

    return this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(id: string) {
    const result = await this.restaurantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Restaurant not found');
    }
    return { message: 'Restaurant deleted successfully' };
  }
}
