import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItem } from './cart-item.entity';
import { MenuOption } from './menu-option.entity';
export declare class CartItemOption extends Auditable {
    additionalPrice: number;
    cartItem: CartItem;
    cartItemId: string;
    menuOption: MenuOption;
    menuOptionId: string;
}
