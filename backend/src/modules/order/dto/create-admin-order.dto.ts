import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

class OrderItemDto {
  @ApiProperty({ description: 'Menu item ID' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity' })
  quantity: number;
}

export class CreateAdminOrderDto {
  @ApiProperty({ description: 'User ID to place the order for' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Restaurant ID' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Delivery type',
    enum: ['delivery', 'collection'],
  })
  @IsIn(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';

  @ApiProperty({ description: 'Payment method', enum: ['cash', 'card', 'cod'] })
  @IsIn(['cash', 'card', 'cod'])
  paymentMethod: 'cash' | 'card' | 'cod';

  @ApiPropertyOptional({ description: 'Payment status' })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiPropertyOptional({ description: 'Order note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Delivery address' })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;
}
