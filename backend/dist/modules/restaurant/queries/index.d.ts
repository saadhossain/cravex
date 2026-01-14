import { RestaurantListQueryDto } from '../dto';
export declare class GetRestaurantsQuery {
    readonly query: RestaurantListQueryDto;
    constructor(query: RestaurantListQueryDto);
}
export declare class GetRestaurantBySlugQuery {
    readonly slug: string;
    constructor(slug: string);
}
export declare class GetRestaurantByIdQuery {
    readonly id: string;
    constructor(id: string);
}
