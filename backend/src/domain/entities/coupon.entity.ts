import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Restaurant } from './restaurant.entity';

export type DiscountType = 'percentage' | 'fixed';

@Entity('coupons')
export class Coupon extends Auditable {
  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumOrder: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscount: number;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validTo: Date;

  @Column({ nullable: true })
  maxUsageCount: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: true })
  isActive: boolean;

  // Relations - null means site-wide coupon
  @ManyToOne(() => Restaurant, { nullable: true })
  restaurant: Restaurant;

  @Column({ nullable: true })
  restaurantId: string;
}
