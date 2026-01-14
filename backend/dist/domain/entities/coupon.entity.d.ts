import { Auditable } from '../../shared/domain/auditable.entity';
import { Restaurant } from './restaurant.entity';
export type DiscountType = 'percentage' | 'fixed';
export declare class Coupon extends Auditable {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minimumOrder: number;
    maxDiscount: number;
    validFrom: Date;
    validTo: Date;
    maxUsageCount: number;
    usageCount: number;
    isActive: boolean;
    restaurant: Restaurant;
    restaurantId: string;
}
