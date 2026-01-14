import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItem } from './cart-item.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';
export type DeliveryType = 'delivery' | 'collection';
export declare class Cart extends Auditable {
    deliveryType: DeliveryType;
    specialInstructions: string;
    couponCode: string;
    discountAmount: number;
    user: User;
    userId: string;
    restaurant: Restaurant;
    restaurantId: string | null;
    items: CartItem[];
}
