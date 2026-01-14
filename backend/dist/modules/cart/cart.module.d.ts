import { AddToCartHandler, RemoveCartItemHandler, UpdateCartItemHandler } from './commands/handlers';
import { GetCartHandler } from './queries/handlers';
export declare const CommandHandlers: (typeof AddToCartHandler | typeof RemoveCartItemHandler | typeof UpdateCartItemHandler)[];
export declare const QueryHandlers: (typeof GetCartHandler)[];
export declare class CartModule {
}
