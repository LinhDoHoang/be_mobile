import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { LocalStrategy } from 'src/common/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy/jwt-auth.strategy';
import { JwtRefreshTokenStrategy } from 'src/common/strategy/jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  imports: [UsersModule, MailModule, JwtModule],
  exports: [AuthService],
})
export class AuthModule {}
