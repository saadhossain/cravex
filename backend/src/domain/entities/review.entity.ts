import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review extends Auditable {
  @Column({ type: 'int' })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @Column({ nullable: true })
  orderId: string;
}
