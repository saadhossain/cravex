import { Auditable } from '../../shared/domain/auditable.entity';
import { DealItem } from './deal-item.entity';
import { Restaurant } from './restaurant.entity';
export type DealType = 'percentage' | 'fixed_price' | 'bundle';
export declare class Deal extends Auditable {
    name: string;
    description: string;
    dealType: DealType;
    discountPercent: number;
    fixedPrice: number;
    imageUrl: string;
    bannerText: string;
    validFrom: Date;
    validTo: Date;
    isActive: boolean;
    displayOrder: number;
    restaurant: Restaurant;
    restaurantId: string;
    dealItems: DealItem[];
}
