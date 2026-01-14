import { OrderItem, OrderItemOption } from 'src/domain/entities';
import { Order } from 'src/domain/entities/order.entity';
import { UserResponseDto } from '../../auth/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    discountAmount: number;
    subtotal: number;
    createdAt: Date;
    deliveryType: string;
    paymentStatus: string;
    restaurant: RestaurantResponseDto;
    items: OrderItemResponseDto[];
    user?: UserResponseDto;
    static fromEntity(entity: Order): OrderResponseDto;
}
export declare class OrderItemResponseDto {
    id: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: OrderItemOptionResponseDto[];
    static fromEntity(entity: OrderItem): OrderItemResponseDto;
}
export declare class OrderItemOptionResponseDto {
    name: string;
    price: number;
    static fromEntity(entity: OrderItemOption): OrderItemOptionResponseDto;
}
