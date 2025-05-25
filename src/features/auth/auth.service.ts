import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change.dto';
import { LoginDto } from './dto/log-in.dto';
import { TokenPayload } from 'src/common/constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly loggerService: Logger;
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.loggerService = new Logger('AuthService');
  }

  async register(dto: CreateUserDto) {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);
      if (existingUser)
        throw new BadRequestException({
          isControlled: true,
          message: 'User existed, use different email',
          data: null,
        });
      const newUser = await this.userService.create(dto);
      this.mailService.sendWelcoming({
        email: dto.email,
        fullName: `${dto.firstName} ${dto.lastName}`,
      });
      return newUser;
    } catch (error) {
      this.loggerService.error('User registeration failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async forgotPassword(dto: RequestForgotPasswordDto) {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);

      if (existingUser) {
        const password = Math.random().toString(36).slice(2, 11);
        const hashTempPassword = await bcrypt.hash(password, 10);
        this.mailService.sendForgot({
          email: existingUser.email,
          fullName: `${existingUser.firstName} ${existingUser.lastName}`,
          password,
        });

        await this.userService.update(existingUser.id, {
          tempPassword: hashTempPassword,
        });
      }

      return 'oke';
    } catch (error) {
      this.loggerService.error('User registeration failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async login(dto: LoginDto) {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);

      if (!existingUser)
        throw new BadRequestException({
          isControlled: true,
          message: 'Wrong credential',
          data: null,
        });

      const isMatchPassword = await bcrypt.compare(
        dto.password,
        existingUser.password,
      );

      if (isMatchPassword) {
        await this.userService.update(existingUser.id, { tempPassword: null });
        return await this.userService.findOne(existingUser.id);
      }

      const isMatchTempPassword = await bcrypt.compare(
        dto.password,
        existingUser.tempPassword,
      );

      if (isMatchTempPassword) {
        const hashPassword = await bcrypt.hash(dto.password, 10);
        await this.userService.update(existingUser.id, {
          password: hashPassword,
          tempPassword: null,
        });
        return await this.userService.findOne(existingUser.id);
      }

      return null;
    } catch (error) {
      this.loggerService.error('Log in failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async verifyPassword(password: string, email: string) {
    try {
      const existingUser = await this.userService.findByEmail(email);

      if (!existingUser) {
        throw new BadRequestException({
          isControlled: true,
          message: 'Wrong credential',
          data: null,
        });
      }
      const isMatchPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isMatchPassword) {
        throw new BadRequestException({
          isControlled: true,
          message: 'Wrong credential',
          data: null,
        });
      }

      return existingUser;
    } catch (error) {
      this.loggerService.error('Reset password failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async changePassword(dto: ChangePasswordDto) {
    if (dto.confirmPassword !== dto.newPassword)
      throw new BadRequestException({
        isControlled: true,
        message: 'New password and confirm password are not the same',
        data: null,
      });
    try {
      const existingUser = await this.userService.findByEmail(dto.email);

      const newPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.userService.update(existingUser.id, { password: newPassword });

      return 'oke';
    } catch (error) {
      this.loggerService.error('Reset password failed', error.stack);
      if (error instanceof HttpException) {
        throw new BadRequestException(error);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  getCookieWithJwtAccessToken(user) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return token;
  }

  getCookieWithJwtRefreshToken(user) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return token;
  }
}
