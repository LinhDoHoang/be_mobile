import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Debt } from 'src/features/debts/entities/debt.entity';
import { Notification } from 'src/features/notifications/entities/notification.entity';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import { User } from 'src/features/users/entities/user.entity';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'postgres',
    //     host: 'localhost',
    //     port: 5432,
    //     username: 'postgres',
    //     password: process.env.DB_PASS || 'linh310304',
    //     database: 'mobile',
    //     entities: [Transaction, User, Debt, Notification],
    //     synchronize: true,
    //     autoLoadEntities: true,
    //     logging: true,
    //   }),
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        entities: [Transaction, User, Debt, Notification],
        logging: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
