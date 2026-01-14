import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { MenuItem } from './menu-item.entity';
import { OrderItemOption } from './order-item-option.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends Auditable {
  @Column()
  menuItemName: string; // snapshot

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  specialInstructions: string;

  // Relations
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => MenuItem)
  menuItem: MenuItem;

  @Column()
  menuItemId: string;

  @OneToMany(() => OrderItemOption, (option) => option.orderItem, {
    cascade: true,
  })
  selectedOptions: OrderItemOption[];
}
