import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { CartItem } from './cart-item.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

export type DeliveryType = 'delivery' | 'collection';

@Entity('carts')
export class Cart extends Auditable {
  @Column({
    type: 'enum',
    enum: ['delivery', 'collection'],
    default: 'delivery',
  })
  deliveryType: DeliveryType;

  @Column({ nullable: true })
  specialInstructions: string;

  @Column({ nullable: true })
  couponCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  // Relations
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Restaurant, { nullable: true })
  restaurant: Restaurant;

  @Column({ nullable: true })
  restaurantId: string | null;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
