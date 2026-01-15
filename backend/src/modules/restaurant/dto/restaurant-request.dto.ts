import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Tasty Burger',
    description: 'The name of the restaurant',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Best burgers in town',
    description: 'The description of the restaurant',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '123 Main St, London',
    description: 'The address of the restaurant',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    example: 51.5074,
    description: 'The latitude of the restaurant',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -0.1278,
    description: 'The longitude of the restaurant',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    example: '+441234567890',
    description: 'The phone number of the restaurant',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contact@tastyburger.com',
    description: 'The email of the restaurant',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: { monday: { open: '09:00', close: '22:00', isClosed: false } },
    description: 'The opening hours of the restaurant',
  })
  @IsOptional()
  @IsObject()
  openingHours?: Record<
    string,
    { open: string; close: string; isClosed: boolean }
  >;

  @ApiProperty({ example: 15.0, description: 'The minimum delivery amount' })
  @IsNumber()
  @Min(0)
  minimumDelivery: number;

  @ApiProperty({ example: 2.5, description: 'The delivery fee' })
  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @ApiProperty({
    example: 30,
    description: 'The estimated delivery time in minutes',
  })
  @IsNumber()
  @Min(1)
  deliveryTimeMinutes: number;

  @ApiPropertyOptional({
    example: ['Burgers', 'American'],
    description: 'The cuisine types offered',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  @ApiPropertyOptional({
    example: ['Halal', 'Vegetarian Friendly'],
    description: 'Tags for the restaurant',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateRestaurantDto extends CreateRestaurantDto {}
