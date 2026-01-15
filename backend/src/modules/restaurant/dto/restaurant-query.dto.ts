import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RestaurantListQueryDto {
  @ApiPropertyOptional({
    example: 'burger',
    description: 'Search term for restaurant name or cuisine',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'SW1A 1AA',
    description: 'Postcode for location-based search',
  })
  @IsOptional()
  @IsString()
  postcode?: string;

  @ApiPropertyOptional({
    example: ['Italian', 'Pizza'],
    description: 'Filter by cuisine types',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: ['rating', 'deliveryTime', 'minimumDelivery'],
    description: 'Sort field',
  })
  @IsOptional()
  @IsEnum(['rating', 'deliveryTime', 'minimumDelivery'])
  sortBy?: 'rating' | 'deliveryTime' | 'minimumDelivery';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort order' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
