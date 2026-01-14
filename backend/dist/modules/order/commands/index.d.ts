import { CreateOrderDto } from '../dto';
export declare class CreateOrderCommand {
    readonly userId: string;
    readonly dto: CreateOrderDto;
    constructor(userId: string, dto: CreateOrderDto);
}
export declare class UpdateParameters {
    status: string;
}
export declare class UpdateOrderCommand {
    readonly orderId: string;
    readonly userId: string;
    readonly params: UpdateParameters;
    constructor(orderId: string, userId: string, params: UpdateParameters);
}
