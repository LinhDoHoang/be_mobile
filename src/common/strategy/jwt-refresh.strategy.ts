import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/features/users/users.service';
import { TokenPayload } from '../constant';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.Refresh;

          if (!token) {
            throw new UnauthorizedException({
              isControlled: true,
              message: 'Please log in again',
            });
          }

          return token;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException({
        isControlled: true,
        message: 'Invalid token',
      });
    }

    return user;
  }
}
