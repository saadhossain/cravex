import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuOptionGroup } from './menu-option-group.entity';

@Entity('menu_options')
export class MenuOption extends Auditable {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additionalPrice: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  displayOrder: number;

  // Relations
  @ManyToOne(() => MenuOptionGroup, (group) => group.options)
  group: MenuOptionGroup;

  @Column()
  groupId: string;
}
