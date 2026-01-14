import { Auditable } from '../../shared/domain/auditable.entity';
import { Restaurant } from './restaurant.entity';
export declare class DeliveryZone extends Auditable {
    postcode: string;
    deliveryFee: number;
    estimatedMinutes: number;
    isActive: boolean;
    restaurant: Restaurant;
    restaurantId: string;
}
