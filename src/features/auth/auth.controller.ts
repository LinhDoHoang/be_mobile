import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { ChangePasswordDto } from './dto/change.dto';
import { ConfirmPassword } from 'src/common/guard/confirm-password.guard';
import { LoginDto } from './dto/log-in.dto';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';
import { User } from 'src/common/decorator/auth.decorator';
import JwtAuthGuard from 'src/common/guard/jwt-auth.guard';
import JwtRefreshGuard from 'src/common/guard/jwt-refresh.guard';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly loggerService: Logger;
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    this.loggerService = new Logger('AuthController');
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Create user successfully' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    this.loggerService.debug('Start register');
    const result = await this.authService.register(dto);
    this.loggerService.debug('Complete register');
    return result;
  }

  @ApiOperation({ summary: 'Forget password' })
  @ApiBody({ type: RequestForgotPasswordDto })
  @ApiResponse({ status: 201, description: 'oke' })
  @Post('forgot-password')
  requestForgotPassword(@Body() dto: RequestForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 201, description: 'oke' })
  @Post('change-password')
  @UseGuards(ConfirmPassword)
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'oke' })
  @Post('log-in')
  async logIn(@Res() res, @Body() dto: LoginDto) {
    const user = await this.authService.login(dto);

    if (!user) {
      throw new BadRequestException({
        isControlled: true,
        message: 'Wrong credential',
        data: null,
      });
    }

    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user);

    await this.userService.update(user?.id, {
      refreshToken,
    });

    const accessTokenCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;

    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.status(200).json({
      message: 'Login success',
      data: null,
    });
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({ status: 200, description: 'oke' })
  @UseGuards(JwtAuthGuard)
  @Get('log-out')
  async logOut(@User() user, @Res() response) {
    await this.userService.removeRefreshToken(user.email);

    response.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());

    const res = {
      message: 'Log out successfully',
      data: null,
    };

    return response.status(HttpStatus.OK).json(res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'oke' })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@User() user, @Res() response) {
    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(user);

    response.setHeader(
      'Set-Cookie',
      `Authentication=${accessTokenCookie}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
    );

    const res = {
      message: 'Success',
      data: null,
    };

    return response.status(HttpStatus.OK).send(res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'oke' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@User() user) {
    return plainToInstance(UserResponseDto, user);
  }
}
