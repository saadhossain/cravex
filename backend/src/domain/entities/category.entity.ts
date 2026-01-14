import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { Restaurant } from './restaurant.entity';

@Entity('categories')
export class Category extends Auditable {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant;

  @Column()
  restaurantId: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];
}
