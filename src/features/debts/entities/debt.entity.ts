import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/features/users/entities/user.entity';
import { DebtsStatus, DebtsType } from 'src/common/constant';

@Entity({ name: 'debts' })
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.debts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'type', type: 'enum', enum: DebtsType })
  type: DebtsType;

  @Column({ name: 'amount', type: 'numeric' })
  amount: number;

  @Column({ name: 'debtor_name', type: 'varchar' })
  debtorName: string;

  @Column({ name: 'detail', type: 'text' })
  detail: string;

  @Column({ name: 'debt_date', type: 'timestamp' })
  debtDate: Date;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'status', type: 'enum', enum: DebtsStatus })
  status: DebtsStatus;
}
