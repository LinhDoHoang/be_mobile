import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import { Notification } from 'src/features/notifications/entities/notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'temp_password', type: 'varchar', nullable: true })
  tempPassword: string;

  @Column({
    name: 'target',
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: true,
  })
  target: number;

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
    name: 'created_at',
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
