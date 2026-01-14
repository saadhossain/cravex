export declare class SelectedOptionDto {
    optionGroupId: string;
    optionId: string;
    optionIds: string[];
}
export declare class AddToCartDto {
    menuItemId: string;
    quantity: number;
    selectedOptions?: SelectedOptionDto[];
    specialInstructions?: string;
}
export declare class UpdateCartItemDto {
    quantity?: number;
    selectedOptions?: SelectedOptionDto[];
    specialInstructions?: string;
}
export declare class ApplyCouponDto {
    code: string;
}
export declare class SetDeliveryTypeDto {
    deliveryType: 'delivery' | 'collection';
}
