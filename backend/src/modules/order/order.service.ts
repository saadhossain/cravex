import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { Order } from '../../domain/entities/order.entity';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';
import { AdminOrdersQueryDto, CreateAdminOrderDto } from './dto';

@Injectable()
export class OrderService {
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
    private readonly dataSource: DataSource,
  ) {}

  async getOrdersAdmin(query: AdminOrdersQueryDto) {
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

    const validSortFields = ['createdAt', 'total', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`order.${sortField}`, sortOrder);

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

  async getOrderAdmin(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['restaurant', 'user', 'items', 'items.menuItem'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrderAdmin(dto: CreateAdminOrderDto) {
    const { userId, restaurantId, items, deliveryType, paymentMethod, note } =
      dto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const menuItemIds = items.map((i: any) => i.menuItemId);
    const dbMenuItems = await this.menuItemRepository.findBy({
      id: In(menuItemIds),
    });

    if (dbMenuItems.length !== items.length) {
      throw new NotFoundException('One or more menu items not found');
    }

    const menuItemMap = new Map(dbMenuItems.map((i) => [i.id, i]));

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
        paymentStatus: dto.paymentStatus || 'pending',
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

  async updateOrderAdmin(id: string, updateOrderDto: any) {
    const {
      userId,
      restaurantId,
      items,
      deliveryType,
      paymentMethod,
      paymentStatus,
      note,
      status,
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
      if (userId) order.userId = userId;
      if (restaurantId) order.restaurantId = restaurantId;
      if (deliveryType) order.deliveryType = deliveryType;
      if (paymentMethod) order.paymentMethod = paymentMethod;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (note !== undefined) order.specialInstructions = note;
      if (status) order.status = status;

      if (items && items.length > 0) {
        const menuItemIds = items.map((i: any) => i.menuItemId);
        const dbMenuItems = await this.menuItemRepository.findBy({
          id: In(menuItemIds),
        });

        const menuItemMap = new Map(dbMenuItems.map((i) => [i.id, i]));
        let subtotal = 0;
        const newOrderItems: OrderItem[] = [];

        await queryRunner.manager.delete(OrderItem, { orderId: id });

        for (const item of items) {
          const dbItem = menuItemMap.get(item.menuItemId);
          if (!dbItem) continue;

          const price = Number(dbItem.price);
          const lineTotal = price * item.quantity;
          subtotal += lineTotal;

          const orderItem = queryRunner.manager.create(OrderItem, {
            order: order,
            menuItemName: dbItem.name,
            menuItemId: dbItem.id,
            unitPrice: price,
            quantity: item.quantity,
            totalPrice: lineTotal,
          });
          newOrderItems.push(orderItem);
        }

        order.subtotal = subtotal;

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
          if (subtotal < minDelivery) {
            throw new Error(`Minimum order amount is ${minDelivery}`);
          }
        }
        order.deliveryFee = deliveryFee;
        order.total = subtotal + deliveryFee - (Number(order.discount) || 0);

        order.items = newOrderItems;
      } else if (items && items.length === 0) {
        throw new Error('Order must have at least one item');
      }

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
}
