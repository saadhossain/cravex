import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { MenuOption } from './menu-option.entity';
export type SelectionType = 'single' | 'multiple';
export declare class MenuOptionGroup extends Auditable {
    name: string;
    selectionType: SelectionType;
    minSelections: number;
    maxSelections: number;
    freeSelections: number;
    isRequired: boolean;
    displayOrder: number;
    menuItem: MenuItem;
    menuItemId: string;
    options: MenuOption[];
}
