import { CreateCategoryHandler, CreateMenuItemHandler } from './commands/handlers';
import { GetMenuByRestaurantHandler } from './queries/handlers';
export declare const CommandHandlers: (typeof CreateCategoryHandler | typeof CreateMenuItemHandler)[];
export declare const QueryHandlers: (typeof GetMenuByRestaurantHandler)[];
export declare class MenuModule {
}
