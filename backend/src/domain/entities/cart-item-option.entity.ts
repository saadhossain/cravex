import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItem } from './cart-item.entity';
import { MenuOption } from './menu-option.entity';

@Entity('cart_item_options')
export class CartItemOption extends Auditable {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additionalPrice: number;

  // Relations
  @ManyToOne(() => CartItem, (cartItem) => cartItem.selectedOptions, {
    onDelete: 'CASCADE',
  })
  cartItem: CartItem;

  @Column()
  cartItemId: string;

  @ManyToOne(() => MenuOption)
  menuOption: MenuOption;

  @Column()
  menuOptionId: string;
}
