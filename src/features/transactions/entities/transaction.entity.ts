import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/features/users/entities/user.entity';
import { TransactionsType } from 'src/common/constant';
import { Debt } from 'src/features/debts/entities/debt.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
    enum: TransactionsType,
    nullable: false,
  })
  type: TransactionsType;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail: string;

  @Column({ name: 'date', type: 'timestamp', nullable: false })
  date: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: new Date() })
  createdAt: Date;

  @OneToOne(() => Debt, (debt) => debt.transaction, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  debt: Debt;
}
