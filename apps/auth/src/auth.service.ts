import { UserCreateCommand } from '@app/common/user/cmd/user.create.cmd';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { ProducerEmailService } from './queues/producer.email';

@Injectable()
export class AuthService {

  constructor(
    private emailService: EmailService,
    private producer: ProducerEmailService
  ){}

  async create(request: UserCreateCommand): Promise<any> {
      const emailData = {
        email: request.email,
        subject: 'Welcome to Our Community',
        html: `<p>Hello ${request.firstName},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`,
      };
      const result = await this.emailService.sendEmail(emailData);
      await this.producer.addToEmailQueue(result);
  }
}
