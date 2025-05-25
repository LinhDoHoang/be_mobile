import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw new UnauthorizedException({
        isControlled: true,
        message: 'Session expired. Please log in',
        data: null,
      });
    }
    return user;
  }
}
