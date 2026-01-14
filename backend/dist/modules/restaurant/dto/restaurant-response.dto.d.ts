import { Restaurant } from 'src/domain/entities/restaurant.entity';
export declare class RestaurantResponseDto {
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
    static fromEntity(entity: Restaurant): RestaurantResponseDto;
}
export declare class RestaurantDetailDto extends RestaurantResponseDto {
    openingHours: any;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
