import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/features/auth/auth.service';

@Injectable()
export class ConfirmPassword implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, currentPassword } = request?.body;
    console.log(email, currentPassword);
    await this.authService.verifyPassword(currentPassword, email);

    return true;
  }
}
