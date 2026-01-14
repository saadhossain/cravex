export declare class CreateRestaurantDto {
    name: string;
    description?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    openingHours?: Record<string, {
        open: string;
        close: string;
        isClosed: boolean;
    }>;
    minimumDelivery: number;
    deliveryFee: number;
    deliveryTimeMinutes: number;
    cuisineTypes?: string[];
    tags?: string[];
}
export declare class UpdateRestaurantDto extends CreateRestaurantDto {
}
