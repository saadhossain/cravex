export declare class RestaurantListQueryDto {
    search?: string;
    postcode?: string;
    cuisineTypes?: string[];
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'deliveryTime' | 'minimumDelivery';
    sortOrder?: 'asc' | 'desc';
}
