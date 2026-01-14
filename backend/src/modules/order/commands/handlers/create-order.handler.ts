import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/domain/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import {
  Cart,
  CartItem,
  OrderItem,
  OrderItemOption,
  Restaurant,
  User,
} from '../../../../domain/entities';
import { OrderResponseDto } from '../../dto';
import { CreateOrderCommand } from '../index';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User) // for address validation if needed
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderResponseDto> {
    const { userId, dto } = command;

    // 1. Fetch User's Cart
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: [
        'items',
        'items.menuItem',
        'items.selectedOptions',
        'items.selectedOptions.menuOption',
        'restaurant',
      ],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    if (!cart.restaurant) {
      throw new InternalServerErrorException('Cart is missing restaurant data'); // Should not happen
    }

    // 2. Calculate Totals
    let itemsTotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cart.items) {
      if (!item.menuItem) continue;

      let optionsTotal = 0;
      const optionsData: any[] = [];

      if (item.selectedOptions) {
        for (const opt of item.selectedOptions) {
          if (opt.menuOption) {
            optionsTotal += Number(opt.menuOption.additionalPrice);
            optionsData.push({
              optionName: opt.menuOption.name,
              price: Number(opt.menuOption.additionalPrice),
            });
          }
        }
      }

      const unitPrice = Number(item.menuItem.price);
      const lineTotal = (unitPrice + optionsTotal) * item.quantity;
      itemsTotal += lineTotal;

      orderItemsData.push({
        menuItemName: item.menuItem.name,
        menuItemId: item.menuItem.id, // Keep reference? Entities uses snapshot only?
        // Plan OrderItem: menuItemId (can be null if deleted), menuItemName, price
        price: unitPrice,
        quantity: item.quantity,
        totalPrice: lineTotal,
        options: optionsData,
      });
    }

    // Delivery Fee logic
    let deliveryFee = 0;
    if (dto.deliveryType === 'delivery') {
      deliveryFee = Number(cart.restaurant.deliveryFee);
      const minDelivery = Number(cart.restaurant.minimumDelivery);
      if (itemsTotal < minDelivery) {
        throw new BadRequestException(
          `Minimum delivery amount of ${minDelivery} not met`,
        );
      }
    }

    const discountAmount = 0; // logic for coupon
    const totalAmount = itemsTotal + deliveryFee - discountAmount;

    // 3. Create Order Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create Order
      // Create Order
      const order = queryRunner.manager.create(Order, {
        userId,
        restaurantId: cart.restaurantId!, // Assert non-null
        status: 'pending',
        total: totalAmount, // Fixed
        subtotal: itemsTotal,
        deliveryFee,
        discount: discountAmount, // Fixed
        deliveryType: dto.deliveryType,
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'pending',
        specialInstructions: dto.note,
        deliveryAddressId: dto.addressId, // Fixed mapping to ID
        // deliveryAddress: ... removed
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
          Math.random() * 1000,
        )}`,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create Order Items and Options
      for (const itemData of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          menuItemName: itemData.menuItemName,
          // menuItemId: itemData.menuItemId,
          menuItemId: itemData.menuItemId,
          unitPrice: itemData.price, // Fixed prop
          quantity: itemData.quantity,
          totalPrice: itemData.totalPrice,
        });
        const savedOrderItem = await queryRunner.manager.save(orderItem);

        if (itemData.options && itemData.options.length > 0) {
          const orderItemOptions = itemData.options.map((opt: any) =>
            queryRunner.manager.create(OrderItemOption, {
              orderItemId: savedOrderItem.id,
              optionName: opt.optionName,
              additionalPrice: opt.price, // Fixed prop
            }),
          );
          await queryRunner.manager.save(orderItemOptions);
        }
      }

      // Clear Cart (Delete items)
      await queryRunner.manager.delete(CartItem, { cartId: cart.id });
      // Optionally update cart fields to empty
      cart.restaurantId = null; // Reset restaurant lock so user can order from others?
      // Usually we keep the cart shell. DTOs check for empty items.
      // If we reset restaurantId, AddToCart needs to handle null restaurantId transition (it does).
      await queryRunner.manager.update(Cart, cart.id, { restaurantId: null });

      await queryRunner.commitTransaction();

      // fetch full order for return
      const fullOrder = await this.dataSource.manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.selectedOptions', 'restaurant'],
      });

      return OrderResponseDto.fromEntity(fullOrder!);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
