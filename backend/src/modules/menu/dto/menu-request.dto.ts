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
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

// Option DTOs
export class CreateMenuOptionDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  additionalPrice: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreateMenuOptionGroupDto {
  @IsString()
  name: string;

  @IsEnum(['single', 'multiple'])
  selectionType: 'single' | 'multiple';

  @IsNumber()
  @Min(0)
  minSelections: number;

  @IsOptional()
  @IsNumber()
  maxSelections?: number;

  @IsNumber()
  @Min(0)
  freeSelections: number;

  @IsBoolean()
  isRequired: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionDto)
  options: CreateMenuOptionDto[];
}

// MenuItem DTOs
export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @IsOptional()
  @IsBoolean()
  isSpicy?: boolean;

  @IsOptional()
  @IsNumber()
  spicyLevel?: number;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionGroupDto)
  optionGroups?: CreateMenuOptionGroupDto[];
}

export class UpdateMenuItemDto extends CreateMenuItemDto {}
