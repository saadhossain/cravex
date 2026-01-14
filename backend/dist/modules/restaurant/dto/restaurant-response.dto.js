"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = exports.RestaurantDetailDto = exports.RestaurantResponseDto = void 0;
class RestaurantResponseDto {
    id;
    name;
    slug;
    description;
    logoUrl;
    bannerUrl;
    rating;
    reviewCount;
    address;
    minimumDelivery;
    deliveryFee;
    deliveryTimeMinutes;
    isOpen;
    cuisineTypes;
    tags;
    static fromEntity(entity) {
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
        dto.isOpen = true;
        dto.cuisineTypes = entity.cuisineTypes || [];
        dto.tags = entity.tags || [];
        return dto;
    }
}
exports.RestaurantResponseDto = RestaurantResponseDto;
class RestaurantDetailDto extends RestaurantResponseDto {
    openingHours;
    latitude;
    longitude;
    phone;
    email;
}
exports.RestaurantDetailDto = RestaurantDetailDto;
class PaginatedResponseDto {
    data;
    meta;
}
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=restaurant-response.dto.js.map