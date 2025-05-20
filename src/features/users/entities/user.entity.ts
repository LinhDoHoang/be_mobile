import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import { Debt } from 'src/features/debts/entities/debt.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshToken: string;

  @Column({
    name: 'roles',
    type: 'enum',
    enum: ['user', 'admin'],
    nullable: false,
  })
  roles: 'user' | 'admin';

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Debt, (debt) => debt.user)
  debts: Debt[];
}
