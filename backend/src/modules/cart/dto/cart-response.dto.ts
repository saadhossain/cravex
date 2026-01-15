import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Cart, CartItem, CartItemOption } from 'src/domain/entities';
import { MenuItemResponseDto } from '../../menu/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';

export class CartItemOptionResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the option',
  })
  id: string;

  @ApiProperty({
    example: 'Extra Cheese',
    description: 'The name of the option',
  })
  optionName: string;

  @ApiProperty({
    example: 1.5,
    description: 'The additional price for the option',
  })
  additionalPrice: number;

  static fromEntity(entity: CartItemOption): CartItemOptionResponseDto {
    const dto = new CartItemOptionResponseDto();
    dto.id = entity.id;
    dto.optionName = entity.menuOption?.name || 'Unknown';
    dto.additionalPrice = Number(entity.additionalPrice);
    return dto;
  }
}

export class CartItemResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the cart item',
  })
  id: string;

  @ApiProperty({
    type: MenuItemResponseDto,
    description: 'The menu item details',
  })
  menuItem: MenuItemResponseDto;

  @ApiProperty({ example: 2, description: 'The quantity of the item' })
  quantity: number;

  @ApiProperty({ example: 15.0, description: 'The unit price of the item' })
  unitPrice: number;

  @ApiProperty({
    example: 33.0,
    description: 'The total price for this line item (including options)',
  })
  totalPrice: number;

  @ApiProperty({
    type: [CartItemOptionResponseDto],
    description: 'The selected options',
  })
  selectedOptions: CartItemOptionResponseDto[];

  @ApiPropertyOptional({
    example: 'No onions',
    description: 'Special instructions',
    nullable: true,
  })
  specialInstructions: string;

  static fromEntity(entity: CartItem): CartItemResponseDto {
    const dto = new CartItemResponseDto();
    dto.id = entity.id;
    if (entity.menuItem) {
      dto.menuItem = MenuItemResponseDto.fromEntity(entity.menuItem);
    }
    dto.quantity = entity.quantity;
    dto.unitPrice = Number(entity.unitPrice);

    const optionsTotal =
      entity.selectedOptions?.reduce(
        (sum: number, opt: CartItemOption) => sum + Number(opt.additionalPrice),
        0,
      ) || 0;
    dto.totalPrice =
      (Number(entity.unitPrice) + optionsTotal) * entity.quantity;

    dto.selectedOptions =
      entity.selectedOptions?.map(CartItemOptionResponseDto.fromEntity) || [];
    dto.specialInstructions = entity.specialInstructions;
    return dto;
  }
}

export class CartResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the cart',
  })
  id: string;

  @ApiProperty({
    type: RestaurantResponseDto,
    description: 'The restaurant details',
  })
  restaurant: RestaurantResponseDto;

  @ApiProperty({
    type: [CartItemResponseDto],
    description: 'The items in the cart',
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    enum: ['delivery', 'collection'],
    example: 'delivery',
    description: 'The delivery type',
  })
  deliveryType: 'delivery' | 'collection';

  @ApiPropertyOptional({
    example: 'SUMMER20',
    description: 'The applied coupon code',
    nullable: true,
  })
  couponCode: string;

  @ApiProperty({ example: 33.0, description: 'The subtotal amount' })
  subtotal: number;

  @ApiProperty({ example: 5.0, description: 'The discount amount' })
  discount: number;

  @ApiProperty({ example: 2.5, description: 'The delivery fee' })
  deliveryFee: number;

  @ApiProperty({ example: 30.5, description: 'The total amount payable' })
  total: number;

  @ApiProperty({
    example: true,
    description: 'Whether the minimum delivery amount is met',
  })
  minimumDeliveryMet: boolean;

  @ApiProperty({
    example: 0,
    description: 'Amount remaining to reach minimum delivery',
  })
  amountToMinimum: number;

  static fromEntity(entity: Cart): CartResponseDto {
    const dto = new CartResponseDto();
    dto.id = entity.id;
    if (entity.restaurant) {
      dto.restaurant = RestaurantResponseDto.fromEntity(entity.restaurant);
    }
    dto.items = entity.items?.map(CartItemResponseDto.fromEntity) || [];
    dto.deliveryType = entity.deliveryType;
    dto.couponCode = entity.couponCode;

    let subtotal = 0;
    dto.items.forEach((item) => (subtotal += item.totalPrice));
    dto.subtotal = subtotal;

    dto.discount = Number(entity.discountAmount) || 0;
    dto.deliveryFee = 0; // Placeholder
    dto.total = subtotal - dto.discount + dto.deliveryFee;

    return dto;
  }
}
