import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { DebtsStatus } from 'src/common/constant';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';

@Entity({ name: 'debts' })
export class Debt {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Transaction, (transaction) => transaction.debt, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ name: 'debtor_name', type: 'varchar' })
  debtorName: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DebtsStatus,
    default: DebtsStatus.PENDING,
  })
  status: DebtsStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;
}
