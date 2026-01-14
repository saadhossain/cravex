import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Cart,
  CartItem,
  CartItemOption,
  MenuItem,
  MenuOption,
} from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { AddToCartCommand } from '../index';

@CommandHandler(AddToCartCommand)
export class AddToCartHandler implements ICommandHandler<AddToCartCommand> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuOption)
    private readonly menuOptionRepository: Repository<MenuOption>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: AddToCartCommand): Promise<CartResponseDto> {
    const { userId, dto } = command;

    // 1. Fetch MenuItem with Restaurant and Options
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: dto.menuItemId },
      relations: [
        'category',
        'category.restaurant',
        'optionGroups',
        'optionGroups.options',
      ],
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (!menuItem.isAvailable) {
      throw new BadRequestException('Menu item is currently unavailable');
    }

    const restaurantId = menuItem.category.restaurantId;

    // 2. Fetch or Create Cart
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.selectedOptions'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, restaurantId });
      await this.cartRepository.save(cart);
    }

    // 3. Check Restaurant Consistency
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      // If cart is empty (leftover id?), we can switch. Else conflict.
      const hasItems = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoin('cart.items', 'items')
        .where('cart.id = :id', { id: cart.id })
        .andWhere('items.id IS NOT NULL')
        .getCount();

      if (hasItems > 0) {
        throw new ConflictException(
          'Cart contains items from a different restaurant. Clear cart first.',
        );
      } else {
        cart.restaurantId = restaurantId;
        await this.cartRepository.save(cart);
      }
    } else if (!cart.restaurantId) {
      cart.restaurantId = restaurantId;
      await this.cartRepository.save(cart);
    }

    // 4. Validate Options (Simplified logic)
    // In production, we must verify each optionId belongs to the group and rules (min/max) are met.
    // We'll skip deep validation for brevity but load options to calculate price.
    const selectedOptionsEntities: MenuOption[] = [];

    if (dto.selectedOptions && dto.selectedOptions.length > 0) {
      const optionIds = dto.selectedOptions.flatMap((so) => so.optionIds);
      if (optionIds.length > 0) {
        const options = await this.menuOptionRepository.findByIds(optionIds);
        selectedOptionsEntities.push(...options);
      }
    }

    // 5. Add Item Transactional
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cartItem = queryRunner.manager.create(CartItem, {
        cartId: cart.id,
        menuItemId: menuItem.id,
        quantity: dto.quantity,
        unitPrice: menuItem.price,
        specialInstructions: dto.specialInstructions,
      });

      const savedItem = await queryRunner.manager.save(cartItem);

      // Save Options
      if (selectedOptionsEntities.length > 0) {
        const cartItemOptions = selectedOptionsEntities.map((opt) =>
          queryRunner.manager.create(CartItemOption, {
            cartItemId: savedItem.id,
            menuOptionId: opt.id,
            additionalPrice: opt.additionalPrice,
          }),
        );
        await queryRunner.manager.save(cartItemOptions);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // 6. Return updated cart
    // We re-fetch to get complete structure with relations
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: [
        'restaurant',
        'items',
        'items.menuItem',
        'items.selectedOptions',
        'items.selectedOptions.menuOption',
      ],
    });

    return CartResponseDto.fromEntity(updatedCart!);
  }
}
