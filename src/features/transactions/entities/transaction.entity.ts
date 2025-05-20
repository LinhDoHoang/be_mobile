import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/features/users/entities/user.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['income', 'expense'],
    nullable: false,
  })
  type: 'income' | 'expense';

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail: string;

  @Column({ name: 'date', type: 'timestamp', nullable: false })
  date: Date;
}
