import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    enum: ['delivery', 'collection'],
    example: 'delivery',
    description: 'The delivery type',
  })
  @IsEnum(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description:
      'The ID of the delivery address (required if deliveryType is delivery)',
  })
  @IsOptional() // Required if deliveryType is delivery
  @IsUUID()
  addressId?: string;

  @ApiProperty({ example: 'card', description: 'The payment method' })
  @IsEnum(['stripe', 'cash', 'cod']) // Assuming these types
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'SUMMER20', description: 'The coupon code' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({
    example: 'Leave at the door',
    description: 'Note for the order',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
