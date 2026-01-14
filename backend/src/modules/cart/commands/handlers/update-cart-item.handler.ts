import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CartItem,
  CartItemOption,
  MenuOption,
} from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { UpdateCartItemCommand } from '../index';

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler implements ICommandHandler<UpdateCartItemCommand> {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(MenuOption)
    private readonly menuOptionRepository: Repository<MenuOption>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartResponseDto> {
    const { userId, cartItemId, dto } = command;

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'selectedOptions'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenException('You do not own this cart');
    }

    // Update fields
    if (dto.quantity) {
      cartItem.quantity = dto.quantity;
    }
    if (dto.specialInstructions !== undefined) {
      cartItem.specialInstructions = dto.specialInstructions;
    }

    // Transactional update for options if provided
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(cartItem);

      if (dto.selectedOptions) {
        // Remove existing options
        await queryRunner.manager.delete(CartItemOption, {
          cartItemId: cartItem.id,
        });

        // Add new options
        const optionIds = dto.selectedOptions.flatMap((so) => so.optionIds);
        if (optionIds.length > 0) {
          const options = await this.menuOptionRepository.findByIds(optionIds);
          const cartItemOptions = options.map((opt) =>
            queryRunner.manager.create(CartItemOption, {
              cartItemId: cartItem.id,
              menuOptionId: opt.id,
              additionalPrice: opt.additionalPrice,
            }),
          );
          await queryRunner.manager.save(cartItemOptions);
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    if (!cartItem) throw new NotFoundException(); // Redundant strictly but helpful for parser?

    return { id: cartItem.cart.id, items: [] } as any;
  }
}
