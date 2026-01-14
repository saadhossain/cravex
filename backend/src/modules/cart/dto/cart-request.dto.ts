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
  @IsUUID()
  optionGroupId: string;

  @IsUUID()
  optionId: string; // Changed from array optionIds to single optionId per selection entry usually, or array?
  // Plan says: optionIds: string[]
  // But entity `CartItemOption` links to a single `MenuOption`.
  // If `selectionType` is multiple, we might have multiple `CartItemOption` entries?
  // Or one `CartItemOption` represents one selected option.
  // The DTO in plan:
  // optionIds: string[]
  // This implies for a group "Toppings", we send [id1, id2].
  // Handler will explode this to multiple CartItemOption entities.
  // I'll support array.

  @IsArray()
  @IsUUID('4', { each: true })
  optionIds: string[];
}

export class AddToCartDto {
  @IsUUID()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class ApplyCouponDto {
  @IsString()
  code: string;
}

export class SetDeliveryTypeDto {
  @IsEnum(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';
}
