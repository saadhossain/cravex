import { Restaurant } from 'src/domain/entities/restaurant.entity';

export class RestaurantResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  isOpen: boolean;
  cuisineTypes: string[];
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
  openingHours: any;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  // categories and deals would be added here
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
