import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Notification } from 'src/features/notifications/entities/notification.entity';
import { Debt } from 'src/features/debts/entities/debt.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DB_URL'),
  entities: [Transaction, User, Debt, Notification],
  logging: true,
  synchronize: true,
});

export default AppDataSource;
