import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

// Category DTOs
export class CreateCategoryDto {
  @ApiProperty({ example: 'Burgers', description: 'The name of the category' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Delicious flame-grilled burgers',
    description: 'The description of the category',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'The display order of the category',
  })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

// Option DTOs
export class CreateMenuOptionDto {
  @ApiProperty({
    example: 'Extra Cheese',
    description: 'The name of the option',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1.5,
    description: 'The additional price for the option',
  })
  @IsNumber()
  @Min(0)
  additionalPrice: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this option is selected by default',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreateMenuOptionGroupDto {
  @ApiProperty({
    example: 'Toppings',
    description: 'The name of the option group',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ['single', 'multiple'],
    example: 'multiple',
    description: 'The selection type',
  })
  @IsEnum(['single', 'multiple'])
  selectionType: 'single' | 'multiple';

  @ApiProperty({
    example: 0,
    description: 'The minimum number of selections required',
  })
  @IsNumber()
  @Min(0)
  minSelections: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'The maximum number of selections allowed',
  })
  @IsOptional()
  @IsNumber()
  maxSelections?: number;

  @ApiProperty({ example: 0, description: 'The number of free selections' })
  @IsNumber()
  @Min(0)
  freeSelections: number;

  @ApiProperty({
    example: false,
    description: 'Whether a selection is required',
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    type: [CreateMenuOptionDto],
    description: 'The options in this group',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionDto)
  options: CreateMenuOptionDto[];
}

// MenuItem DTOs
export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Cheeseburger',
    description: 'The name of the menu item',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'A juicy beef patty with cheddar cheese',
    description: 'The description of the menu item',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12.99, description: 'The price of the menu item' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the category',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the item is vegetarian',
  })
  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the item is vegan',
  })
  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the item is spicy',
  })
  @IsOptional()
  @IsBoolean()
  isSpicy?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'The spicy level (0-5)' })
  @IsOptional()
  @IsNumber()
  spicyLevel?: number;

  @ApiPropertyOptional({ example: 800, description: 'The number of calories' })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({
    example: ['Gluten', 'Dairy'],
    description: 'The allergens in the item',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @ApiPropertyOptional({
    example: ['Bestseller', 'New'],
    description: 'Tags for the item',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: [CreateMenuOptionGroupDto],
    description: 'The option groups for the item',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionGroupDto)
  optionGroups?: CreateMenuOptionGroupDto[];
}

export class UpdateMenuItemDto extends CreateMenuItemDto {}
