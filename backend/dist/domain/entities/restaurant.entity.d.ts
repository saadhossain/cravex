import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { Deal } from './deal.entity';
import { DeliveryZone } from './delivery-zone.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { User } from './user.entity';
interface DayHours {
    open: string;
    close: string;
    isClosed: boolean;
}
interface OpeningHours {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
}
export declare class Restaurant extends Auditable {
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    rating: number;
    reviewCount: number;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    openingHours: OpeningHours;
    minimumDelivery: number;
    deliveryFee: number;
    deliveryTimeMinutes: number;
    isActive: boolean;
    isFeatured: boolean;
    cuisineTypes: string[];
    tags: string[];
    owner: User;
    ownerId: string;
    categories: Category[];
    deals: Deal[];
    deliveryZones: DeliveryZone[];
    orders: Order[];
    reviews: Review[];
}
export {};
