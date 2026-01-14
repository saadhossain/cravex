import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto';
export declare class CreateRestaurantCommand {
    readonly ownerId: string;
    readonly dto: CreateRestaurantDto;
    constructor(ownerId: string, dto: CreateRestaurantDto);
}
export declare class UpdateRestaurantCommand {
    readonly restaurantId: string;
    readonly ownerId: string;
    readonly dto: UpdateRestaurantDto;
    constructor(restaurantId: string, ownerId: string, dto: UpdateRestaurantDto);
}
