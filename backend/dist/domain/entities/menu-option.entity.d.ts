import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuOptionGroup } from './menu-option-group.entity';
export declare class MenuOption extends Auditable {
    name: string;
    additionalPrice: number;
    isAvailable: boolean;
    isDefault: boolean;
    imageUrl: string;
    displayOrder: number;
    group: MenuOptionGroup;
    groupId: string;
}
