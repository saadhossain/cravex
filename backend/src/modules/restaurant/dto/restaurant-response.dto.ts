import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/domain/entities/restaurant.entity';

export class RestaurantResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the restaurant',
  })
  id: string;

  @ApiProperty({
    example: 'Tasty Burger',
    description: 'The name of the restaurant',
  })
  name: string;

  @ApiProperty({
    example: 'tasty-burger',
    description: 'The slug of the restaurant',
  })
  slug: string;

  @ApiProperty({
    example: 'Best burgers in town',
    description: 'The description of the restaurant',
  })
  description: string;

  @ApiProperty({
    example: 'https://example.com/logo.jpg',
    description: 'The logo URL',
  })
  logoUrl: string;

  @ApiProperty({
    example: 'https://example.com/banner.jpg',
    description: 'The banner URL',
  })
  bannerUrl: string;

  @ApiProperty({ example: 4.5, description: 'The average rating' })
  rating: number;

  @ApiProperty({ example: 100, description: 'The number of reviews' })
  reviewCount: number;

  @ApiProperty({ example: '123 Main St, London', description: 'The address' })
  address: string;

  @ApiProperty({ example: 15.0, description: 'The minimum delivery amount' })
  minimumDelivery: number;

  @ApiProperty({ example: 2.5, description: 'The delivery fee' })
  deliveryFee: number;

  @ApiProperty({ example: 30, description: 'The delivery time in minutes' })
  deliveryTimeMinutes: number;

  @ApiProperty({
    example: true,
    description: 'Whether the restaurant is currently open',
  })
  isOpen: boolean;

  @ApiProperty({
    example: ['Burgers', 'American'],
    description: 'The cuisine types',
  })
  cuisineTypes: string[];

  @ApiProperty({
    example: ['Halal', 'Vegetarian Friendly'],
    description: 'Tags',
  })
  tags: string[];

  static fromEntity(entity: Restaurant): RestaurantResponseDto {
    const dto = new RestaurantResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.slug = entity.slug;
    dto.description = entity.description;
    dto.logoUrl = entity.logoUrl;
    dto.bannerUrl = entity.bannerUrl;
    dto.rating = entity.rating;
    dto.reviewCount = entity.reviewCount;
    dto.address = entity.address;
    dto.minimumDelivery = Number(entity.minimumDelivery);
    dto.deliveryFee = Number(entity.deliveryFee);
    dto.deliveryTimeMinutes = entity.deliveryTimeMinutes;
    // isOpen logic would be computed based on openingHours
    dto.isOpen = true; // Placeholder
    dto.cuisineTypes = entity.cuisineTypes || [];
    dto.tags = entity.tags || [];
    return dto;
  }
}

export class RestaurantDetailDto extends RestaurantResponseDto {
  @ApiProperty({
    example: { monday: { open: '09:00', close: '22:00', isClosed: false } },
    description: 'The opening hours',
  })
  openingHours: any;

  @ApiProperty({ example: 51.5074, description: 'The latitude' })
  latitude: number;

  @ApiProperty({ example: -0.1278, description: 'The longitude' })
  longitude: number;

  @ApiProperty({ example: '+441234567890', description: 'The phone number' })
  phone: string;

  @ApiProperty({
    example: 'contact@tastyburger.com',
    description: 'The email address',
  })
  email: string;
  // categories and deals would be added here
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Total items' })
  total: number;
  @ApiProperty({ example: 1, description: 'Current page' })
  page: number;
  @ApiProperty({ example: 20, description: 'Items per page' })
  limit: number;
  @ApiProperty({ example: 5, description: 'Total pages' })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'The data array' })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
  meta: PaginationMetaDto;
}
