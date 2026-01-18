import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER50', description: 'Unique coupon code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: ['percentage', 'fixed'], example: 'percentage' })
  @IsEnum(['percentage', 'fixed'])
  discountType: 'percentage' | 'fixed';

  @ApiProperty({ example: 10, description: 'Discount amount or percentage' })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ example: 200, description: 'Minimum order amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumOrder?: number;

  @ApiPropertyOptional({ example: 50, description: 'Maximum discount value' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validTo?: Date;

  @ApiPropertyOptional({ example: 100, description: 'Maximum total usages' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsageCount?: number;

  @ApiPropertyOptional({
    description: 'Specific restaurant ID (nullable for site-wide)',
  })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiPropertyOptional({
    description:
      'Specific menu item ID (nullable for restaurant-wide or site-wide)',
  })
  @IsOptional()
  @IsUUID()
  menuItemId?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCouponDto extends CreateCouponDto {}
