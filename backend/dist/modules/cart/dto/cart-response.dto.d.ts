import { Cart, CartItem, CartItemOption } from 'src/domain/entities';
import { MenuItemResponseDto } from '../../menu/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';
export declare class CartItemOptionResponseDto {
    id: string;
    optionName: string;
    additionalPrice: number;
    static fromEntity(entity: CartItemOption): CartItemOptionResponseDto;
}
export declare class CartItemResponseDto {
    id: string;
    menuItem: MenuItemResponseDto;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedOptions: CartItemOptionResponseDto[];
    specialInstructions: string;
    static fromEntity(entity: CartItem): CartItemResponseDto;
}
export declare class CartResponseDto {
    id: string;
    restaurant: RestaurantResponseDto;
    items: CartItemResponseDto[];
    deliveryType: 'delivery' | 'collection';
    couponCode: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    minimumDeliveryMet: boolean;
    amountToMinimum: number;
    static fromEntity(entity: Cart): CartResponseDto;
}
