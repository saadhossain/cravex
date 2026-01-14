import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { Deal } from './deal.entity';
import { MenuItem } from './menu-item.entity';
export type StepType = 'select' | 'customize';
export declare class DealItem extends Auditable {
    stepNumber: number;
    stepTitle: string;
    stepType: StepType;
    quantity: number;
    allowMultipleSame: boolean;
    deal: Deal;
    dealId: string;
    menuItem: MenuItem;
    menuItemId: string;
    category: Category;
    categoryId: string;
}
