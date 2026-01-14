import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Restaurant } from './restaurant.entity';

@Entity('delivery_zones')
export class DeliveryZone extends Auditable {
  @Column()
  postcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ default: 30 })
  estimatedMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.deliveryZones)
  restaurant: Restaurant;

  @Column()
  restaurantId: string;
}
