import { CreateRestaurantHandler, UpdateRestaurantHandler } from './commands/handlers';
import { GetRestaurantByIdHandler, GetRestaurantBySlugHandler, GetRestaurantsHandler } from './queries/handlers';
export declare const CommandHandlers: (typeof CreateRestaurantHandler | typeof UpdateRestaurantHandler)[];
export declare const QueryHandlers: (typeof GetRestaurantByIdHandler | typeof GetRestaurantBySlugHandler | typeof GetRestaurantsHandler)[];
export declare class RestaurantModule {
}
