import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItemOption } from './cart-item-option.entity';
import { Cart } from './cart.entity';
import { MenuItem } from './menu-item.entity';
export declare class CartItem extends Auditable {
    quantity: number;
    unitPrice: number;
    specialInstructions: string;
    addedAt: Date;
    cart: Cart;
    cartId: string;
    menuItem: MenuItem;
    menuItemId: string;
    selectedOptions: CartItemOption[];
}
