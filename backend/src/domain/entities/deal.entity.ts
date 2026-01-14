import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { DealItem } from './deal-item.entity';
import { Restaurant } from './restaurant.entity';

export type DealType = 'percentage' | 'fixed_price' | 'bundle';

@Entity('deals')
export class Deal extends Auditable {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['percentage', 'fixed_price', 'bundle'],
    default: 'percentage',
  })
  dealType: DealType;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedPrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  bannerText: string;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validTo: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.deals)
  restaurant: Restaurant;

  @Column()
  restaurantId: string;

  @OneToMany(() => DealItem, (dealItem) => dealItem.deal)
  dealItems: DealItem[];
}
