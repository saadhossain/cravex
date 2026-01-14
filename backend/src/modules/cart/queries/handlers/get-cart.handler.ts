import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { GetCartQuery } from '../index';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async execute(query: GetCartQuery): Promise<CartResponseDto | null> {
    const { userId } = query;

    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: [
        'restaurant',
        'items',
        'items.menuItem',
        'items.selectedOptions',
        'items.selectedOptions.menuOption',
      ],
    });

    if (!cart) {
      return null;
    }

    // Recalculate totals dynamically before returning?
    // In a real app, we might persist calculated totals in DB on every update.
    // Here we trust DTO mapper to sum it up on read.

    return CartResponseDto.fromEntity(cart);
  }
}
