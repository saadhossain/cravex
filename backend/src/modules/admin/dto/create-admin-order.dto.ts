import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class AdminOrderItemDto {
  @ApiProperty({ description: 'ID of the menu item' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  // For simplicity, omitting options for now as per minimal requirement,
  // but could be added if needed: options: { optionId: string }[]
}

export class CreateAdminOrderDto {
  @ApiProperty({ description: 'ID of the user (customer)' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID of the restaurant' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ type: [AdminOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminOrderItemDto)
  items: AdminOrderItemDto[];

  @ApiProperty({ enum: ['delivery', 'collection'], default: 'collection' })
  @IsEnum(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';

  @ApiProperty({ enum: ['cash', 'card', 'cod'], default: 'cash' })
  @IsEnum(['cash', 'card', 'cod'])
  paymentMethod: 'cash' | 'card' | 'cod';

  @ApiPropertyOptional({ description: 'Payment status' })
  @IsOptional()
  @IsString()
  paymentStatus?: string; // 'pending' | 'paid'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  // Skipping address addressId for now to keep it simple, or assuming default user address
  // If delivery, we might need an address string or ID.
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    description: 'Order status',
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ],
  })
  @IsOptional()
  @IsString()
  status?: string;
}
