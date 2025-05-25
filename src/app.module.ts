import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { DebtsModule } from './features/debts/debts.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformResponseInterceptor } from './common/interceptor/response.interceptor';
import { ValidationInputPipe } from './common/pipe/validation-input.pipe';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AuthModule } from './features/auth/auth.module';
import { MailModule } from './features/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    UsersModule,
    TransactionsModule,
    DebtsModule,
    DatabaseModule,
    NotificationsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationInputPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
