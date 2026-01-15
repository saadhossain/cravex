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

export class SelectedOptionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the option group',
  })
  @IsUUID()
  optionGroupId: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'The IDs of the selected options',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  optionIds: string[];
}

export class AddToCartDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the menu item',
  })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ example: 1, description: 'The quantity of the item' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    type: [SelectedOptionDto],
    description: 'The selected options for the item',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];

  @ApiPropertyOptional({
    example: 'Extra spicy',
    description: 'Special instructions for the item',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateCartItemDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'The new quantity of the item',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    type: [SelectedOptionDto],
    description: 'The new selected options',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];

  @ApiPropertyOptional({
    example: 'No onions',
    description: 'The new special instructions',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class ApplyCouponDto {
  @ApiProperty({ example: 'SUMMER20', description: 'The coupon code' })
  @IsString()
  code: string;
}

export class SetDeliveryTypeDto {
  @ApiProperty({
    enum: ['delivery', 'collection'],
    example: 'delivery',
    description: 'The delivery type',
  })
  @IsEnum(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';
}
