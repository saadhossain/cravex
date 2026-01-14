import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';
export declare class OrderItemOption extends Auditable {
    optionName: string;
    additionalPrice: number;
    orderItem: OrderItem;
    orderItemId: string;
    menuOption: MenuOption;
    menuOptionId: string;
}
