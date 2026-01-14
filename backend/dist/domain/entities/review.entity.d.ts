import { Auditable } from '../../shared/domain/auditable.entity';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';
export declare class Review extends Auditable {
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    user: User;
    userId: string;
    restaurant: Restaurant;
    restaurantId: string;
    order: Order;
    orderId: string;
}
