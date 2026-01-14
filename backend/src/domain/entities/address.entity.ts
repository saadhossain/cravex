import { Column, Entity, ManyToOne } from 'typeorm';
import { Auditable } from '../../shared/domain/auditable.entity';
import { User } from './user.entity';

@Entity('addresses')
export class Address extends Auditable {
  @Column()
  label: string;

  @Column()
  fullAddress: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column({ nullable: true })
  instructions: string;

  @Column({ default: false })
  isDefault: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @Column()
  userId: string;
}
