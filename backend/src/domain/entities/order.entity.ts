import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Address } from './address.entity';
import { Coupon } from './coupon.entity';
import { OrderItem } from './order-item.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'delivery' | 'collection';

@Entity('orders')
export class Order extends Auditable {
  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: ['delivery', 'collection'],
    default: 'delivery',
  })
  deliveryType: DeliveryType;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ default: 'pending' })
  paymentStatus: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  couponCode: string;

  @Column({ nullable: true })
  specialInstructions: string;

  @Column({ nullable: true })
  estimatedDeliveryTime: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancellationReason: string;

  // Relations
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Address, { nullable: true })
  deliveryAddress: Address;

  @Column({ nullable: true })
  deliveryAddressId: string;

  @ManyToOne(() => Coupon, { nullable: true })
  coupon: Coupon;

  @Column({ nullable: true })
  couponId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
