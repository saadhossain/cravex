import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_item_options')
export class OrderItemOption extends Auditable {
  @Column()
  optionName: string; // snapshot

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  additionalPrice: number;

  // Relations
  @ManyToOne(() => OrderItem, (orderItem) => orderItem.selectedOptions, {
    onDelete: 'CASCADE',
  })
  orderItem: OrderItem;

  @Column()
  orderItemId: string;

  @ManyToOne(() => MenuOption)
  menuOption: MenuOption;

  @Column()
  menuOptionId: string;
}
