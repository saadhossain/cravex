import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { MenuOptionGroup } from './menu-option-group.entity';

@Entity('menu_items')
export class MenuItem extends Auditable {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number; // Original price before discount

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isVegetarian: boolean;

  @Column({ default: false })
  isVegan: boolean;

  @Column({ default: false })
  isSpicy: boolean;

  @Column({ nullable: true })
  spicyLevel: number; // 1-3

  @Column({ nullable: true })
  calories: number;

  @Column({ nullable: true })
  preparationTime: number; // minutes

  @Column({ type: 'simple-array', nullable: true })
  allergens: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: 0 })
  displayOrder: number;

  // Relations
  @ManyToOne(() => Category, (category) => category.menuItems)
  category: Category;

  @Column()
  categoryId: string;

  @OneToMany(() => MenuOptionGroup, (group) => group.menuItem)
  optionGroups: MenuOptionGroup[];
}
