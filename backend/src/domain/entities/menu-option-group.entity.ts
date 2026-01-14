import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { MenuOption } from './menu-option.entity';

export type SelectionType = 'single' | 'multiple';

@Entity('menu_option_groups')
export class MenuOptionGroup extends Auditable {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['single', 'multiple'],
    default: 'single',
  })
  selectionType: SelectionType;

  @Column({ default: 0 })
  minSelections: number;

  @Column({ nullable: true })
  maxSelections: number; // null = unlimited

  @Column({ default: 0 })
  freeSelections: number; // e.g., 4 free toppings

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  // Relations
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.optionGroups)
  menuItem: MenuItem;

  @Column()
  menuItemId: string;

  @OneToMany(() => MenuOption, (option) => option.group)
  options: MenuOption[];
}
