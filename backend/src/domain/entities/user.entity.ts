import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Address } from './address.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { Review } from './review.entity';

export type UserRole = 'superadmin' | 'restaurant' | 'customer';

@Entity('users')
export class User extends Auditable {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hashed

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: ['superadmin', 'restaurant', 'customer'],
    default: 'customer',
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  refreshToken: string; // hashed refresh token

  // Relations
  @OneToOne(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
