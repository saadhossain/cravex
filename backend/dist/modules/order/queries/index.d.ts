export declare class GetOrdersQuery {
    readonly userId: string;
    constructor(userId: string);
}
export declare class GetOrderDetailQuery {
    readonly userId: string;
    readonly orderId: string;
    constructor(userId: string, orderId: string);
}
