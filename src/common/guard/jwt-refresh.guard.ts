import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw new UnauthorizedException({
        isControlled: true,
        message: 'Please log in',
        data: null,
      });
    }
    return user;
  }
}
