import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { MenuOptionGroup } from './menu-option-group.entity';
export declare class MenuItem extends Auditable {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    isPopular: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel: number;
    calories: number;
    preparationTime: number;
    allergens: string[];
    tags: string[];
    displayOrder: number;
    category: Category;
    categoryId: string;
    optionGroups: MenuOptionGroup[];
}
