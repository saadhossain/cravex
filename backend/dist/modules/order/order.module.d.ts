import { CreateOrderHandler } from './commands/handlers';
import { GetOrderDetailHandler, GetOrdersHandler } from './queries/handlers';
export declare const CommandHandlers: (typeof CreateOrderHandler)[];
export declare const QueryHandlers: (typeof GetOrdersHandler | typeof GetOrderDetailHandler)[];
export declare class OrderModule {
}
