export declare class CreateOrderDto {
    deliveryType: 'delivery' | 'collection';
    addressId?: string;
    paymentMethod: string;
    couponCode?: string;
    note?: string;
}
