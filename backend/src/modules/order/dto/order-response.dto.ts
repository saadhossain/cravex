import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItem, OrderItemOption } from 'src/domain/entities';
import { Order } from 'src/domain/entities/order.entity';
import { UserResponseDto } from '../../auth/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';

export class OrderItemOptionResponseDto {
  @ApiProperty({
    example: 'Extra Cheese',
    description: 'The name of the option',
  })
  name: string;

  @ApiProperty({ example: 1.5, description: 'The price of the option' })
  price: number;

  static fromEntity(entity: OrderItemOption): OrderItemOptionResponseDto {
    const dto = new OrderItemOptionResponseDto();
    dto.name = entity.optionName;
    dto.price = Number(entity.additionalPrice);
    return dto;
  }
}

export class OrderItemResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the order item',
  })
  id: string;

  @ApiProperty({ example: 'Cheeseburger', description: 'The name of the item' })
  itemName: string;

  @ApiProperty({ example: 2, description: 'The quantity' })
  quantity: number;

  @ApiProperty({ example: 12.5, description: 'The unit price' })
  unitPrice: number;

  @ApiProperty({ example: 25.0, description: 'The total price' })
  totalPrice: number;

  @ApiProperty({
    type: [OrderItemOptionResponseDto],
    description: 'The selected options',
  })
  options: OrderItemOptionResponseDto[];

  static fromEntity(entity: OrderItem): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.id = entity.id;
    dto.itemName = entity.menuItemName; // Snapshot name
    dto.quantity = entity.quantity;
    dto.unitPrice = Number(entity.unitPrice);
    dto.totalPrice = Number(entity.totalPrice);
    dto.options =
      entity.selectedOptions?.map(OrderItemOptionResponseDto.fromEntity) || [];
    return dto;
  }
}

export class OrderResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the order',
  })
  id: string;

  @ApiProperty({ example: 'ORD-1234', description: 'The order number' })
  orderNumber: string;

  @ApiProperty({ example: 'pending', description: 'The status of the order' })
  status: string;

  @ApiProperty({ example: 30.5, description: 'The total amount' })
  totalAmount: number;

  @ApiProperty({ example: 2.5, description: 'The delivery fee' })
  deliveryFee: number;

  @ApiProperty({ example: 5.0, description: 'The discount amount' })
  discountAmount: number;

  @ApiProperty({ example: 33.0, description: 'The subtotal amount' })
  subtotal: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The creation date',
  })
  createdAt: Date;

  @ApiProperty({ example: 'delivery', description: 'The delivery type' })
  deliveryType: string;

  @ApiProperty({ example: 'pending', description: 'The payment status' })
  paymentStatus: string;

  @ApiProperty({
    type: RestaurantResponseDto,
    description: 'The restaurant details',
  })
  restaurant: RestaurantResponseDto;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'The order items' })
  items: OrderItemResponseDto[];

  @ApiPropertyOptional({
    type: UserResponseDto,
    description: 'The user details',
    nullable: true,
  })
  user?: UserResponseDto;

  static fromEntity(entity: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = entity.id;
    // entity doesn't have orderNumber in plan? Using ID for now.
    dto.orderNumber = entity.id.substring(0, 8).toUpperCase();
    dto.status = entity.status;
    dto.totalAmount = Number(entity.total);
    dto.deliveryFee = Number(entity.deliveryFee);
    dto.discountAmount = Number(entity.discount);
    dto.subtotal = Number(entity.subtotal);
    dto.createdAt = entity.createdAt;
    dto.deliveryType = entity.deliveryType;
    dto.paymentStatus = entity.paymentStatus;

    if (entity.restaurant) {
      dto.restaurant = RestaurantResponseDto.fromEntity(entity.restaurant);
    }

    dto.items = entity.items?.map(OrderItemResponseDto.fromEntity) || [];

    return dto;
  }
}
