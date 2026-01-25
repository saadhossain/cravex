import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { Deal } from './deal.entity';
import { DeliveryZone } from './delivery-zone.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { User } from './user.entity';

interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

@Entity('restaurants')
export class Restaurant extends Auditable {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  openingHours: OpeningHours;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumDelivery: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ default: 30 })
  deliveryTimeMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'simple-array', nullable: true })
  cuisineTypes: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  // Relations
  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Category, (category) => category.restaurant)
  categories: Category[];

  @OneToMany(() => Deal, (deal) => deal.restaurant)
  deals: Deal[];

  @OneToMany(() => DeliveryZone, (zone) => zone.restaurant)
  deliveryZones: DeliveryZone[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];
}
