import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WelcomeDto } from './dto/welcome.dto';
import { ForgotDto } from './dto/forgot.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcoming(welcomeDto: WelcomeDto) {
    await this.mailerService.sendMail({
      to: welcomeDto.email.trim(),
      subject: 'Welcome newbie',
      template: 'welcome',
      context: {
        email: welcomeDto.email.trim(),
        fullName: welcomeDto.fullName,
      },
    });
    return 'ok';
  }

  async sendForgot(forgotDto: ForgotDto) {
    await this.mailerService.sendMail({
      to: forgotDto.email.trim(),
      subject: 'Forget Password',
      template: 'forgot',
      context: {
        fullName: forgotDto.fullName,
        password: forgotDto.password,
      },
    });
    return 'ok';
  }
}
