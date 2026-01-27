import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateAdminDishDto {
  @ApiProperty({ example: 'Grilled Chicken', description: 'Name of the dish' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Delicious grilled chicken with herbs',
    description: 'Description of the dish',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12.99, description: 'Price of the dish' })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Category ID',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Image URL of the dish',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Is the dish available?' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is the dish popular?' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isPopular?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Is the dish vegetarian?',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isVegetarian?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is the dish vegan?' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isVegan?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is the dish spicy?' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isSpicy?: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: 'Spicy level (1-3)',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  spicyLevel?: number;

  @ApiPropertyOptional({ example: 500, description: 'Calories' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  calories?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Preparation time in minutes',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  preparationTime?: number;

  @ApiPropertyOptional({
    example: ['Gluten', 'Dairy'],
    description: 'List of allergens',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @ApiPropertyOptional({
    example: ['Bestseller', 'New'],
    description: 'Tags for the dish',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 0, description: 'Display order' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  displayOrder?: number;
}

export class UpdateAdminDishDto extends CreateAdminDishDto {}
