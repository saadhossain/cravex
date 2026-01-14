import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards'; // No roles guard needed, any user
import {
  AddToCartCommand,
  RemoveCartItemCommand,
  UpdateCartItemCommand,
} from './commands';
import { AddToCartDto, CartResponseDto, UpdateCartItemDto } from './dto';
import { GetCartQuery } from './queries';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getCart(@CurrentUser() user: User): Promise<CartResponseDto> {
    const cart = await this.queryBus.execute(new GetCartQuery(user.id));
    if (!cart) {
      // Return empty structure representation
      return {
        id: '',
        restaurant: null,
        items: [],
        deliveryType: 'delivery',
        couponCode: null,
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        total: 0,
        minimumDeliveryMet: false,
        amountToMinimum: 0,
      } as any;
    }
    return cart;
  }

  @Post()
  async addToCart(
    @CurrentUser() user: User,
    @Body() dto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.commandBus.execute(new AddToCartCommand(user.id, dto));
  }

  @Patch('items/:itemId')
  async updateCartItem(
    @Param('itemId') itemId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const result = await this.commandBus.execute(
      new UpdateCartItemCommand(user.id, itemId, dto),
    );
    // If command returned partial, re-fetch full
    if (!result || !result.items) {
      return this.getCart(user);
    }
    return result;
  }

  @Delete('items/:itemId')
  async removeCartItem(
    @Param('itemId') itemId: string,
    @CurrentUser() user: User,
  ): Promise<CartResponseDto> {
    await this.commandBus.execute(new RemoveCartItemCommand(user.id, itemId));
    // Return updated cart state
    return this.getCart(user);
  }
}
