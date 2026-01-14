import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { Restaurant } from './restaurant.entity';
export declare class Category extends Auditable {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
    restaurant: Restaurant;
    restaurantId: string;
    menuItems: MenuItem[];
}
