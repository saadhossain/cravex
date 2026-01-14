import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { OrderItemOption } from './order-item-option.entity';
import { Order } from './order.entity';
export declare class OrderItem extends Auditable {
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions: string;
    order: Order;
    orderId: string;
    menuItem: MenuItem;
    menuItemId: string;
    selectedOptions: OrderItemOption[];
}
