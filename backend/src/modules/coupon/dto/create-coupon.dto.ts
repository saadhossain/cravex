import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ description: 'Coupon code', example: 'SAVE20' })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Discount type',
    enum: ['percentage', 'fixed'],
    example: 'percentage',
  })
  @IsIn(['percentage', 'fixed'])
  discountType: 'percentage' | 'fixed';

  @ApiProperty({ description: 'Discount value', example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ description: 'Minimum order amount', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minimumOrder?: number;

  @ApiPropertyOptional({ description: 'Maximum discount amount', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  maxDiscount?: number;

  @ApiPropertyOptional({ description: 'Valid from date' })
  @IsOptional()
  @IsString()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Valid to date' })
  @IsOptional()
  @IsString()
  validTo?: string;

  @ApiPropertyOptional({ description: 'Maximum usage count' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  maxUsageCount?: number;

  @ApiPropertyOptional({
    description: 'Restaurant ID for restaurant-specific coupon',
  })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiPropertyOptional({ description: 'Menu item ID for item-specific coupon' })
  @IsOptional()
  @IsUUID()
  menuItemId?: string;

  @ApiPropertyOptional({ description: 'Is coupon active', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isActive?: boolean;
}
