import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { Category } from './category.entity';
import { Deal } from './deal.entity';
import { MenuItem } from './menu-item.entity';

export type StepType = 'select' | 'customize';

@Entity('deal_items')
export class DealItem extends Auditable {
  @Column()
  stepNumber: number;

  @Column()
  stepTitle: string;

  @Column({
    type: 'enum',
    enum: ['select', 'customize'],
    default: 'select',
  })
  stepType: StepType;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  allowMultipleSame: boolean;

  // Relations
  @ManyToOne(() => Deal, (deal) => deal.dealItems)
  deal: Deal;

  @Column()
  dealId: string;

  @ManyToOne(() => MenuItem, { nullable: true })
  menuItem: MenuItem;

  @Column({ nullable: true })
  menuItemId: string;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;
}
