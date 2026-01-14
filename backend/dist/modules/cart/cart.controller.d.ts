import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { AddToCartDto, CartResponseDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getCart(user: User): Promise<CartResponseDto>;
    addToCart(user: User, dto: AddToCartDto): Promise<CartResponseDto>;
    updateCartItem(itemId: string, user: User, dto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeCartItem(itemId: string, user: User): Promise<CartResponseDto>;
}
