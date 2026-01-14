import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItemOption } from './cart-item-option.entity';
import { Cart } from './cart.entity';
import { MenuItem } from './menu-item.entity';

@Entity('cart_items')
export class CartItem extends Auditable {
  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ nullable: true })
  specialInstructions: string;

  @CreateDateColumn()
  addedAt: Date;

  // Relations
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => MenuItem)
  menuItem: MenuItem;

  @Column()
  menuItemId: string;

  @OneToMany(() => CartItemOption, (option) => option.cartItem, {
    cascade: true,
  })
  selectedOptions: CartItemOption[];
}
