import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { EmailVerificationRepository } from '../repository/email.repository';
import { EmailUtils } from './utils';
import { VerificationToken } from '../models/email.confirmation';

dotenv.config();

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly emailRepository: EmailVerificationRepository,
    private readonly emailUtils: EmailUtils,
  ) {}

  async createEmailToken(email: string): Promise<boolean> {
    try {
      const emailVerification = await this.emailRepository.findByEmail(email);

      if (emailVerification && this.isRecentlySent(emailVerification.timestamp)) {
        throw new HttpException('LOGIN.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        await this.emailRepository.upsertVerificationToken(email, this.generateEmailToken(), new Date());
        this.logger.debug(`Email token created for ${email}`);
        return true;
      }
    } catch (error) {
      this.logger.error(`Error creating email token: ${error.message}`);
      throw error;
    }
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    try {
      const model = await this.emailRepository.findByEmail(email);
      if (!model || !model.token) {
        throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
      }
      this.logger.debug(`Email Token: ${model.token}`);

      const sent = await this.emailUtils.sendVerificationEmail(email, model.token);
      if (sent) {
        this.logger.debug(`Email verification sent to ${email}`);
      } else {
        this.logger.warn(`Failed to send email verification to ${email}`);
      }
      return sent;
    } catch (error) {
      this.logger.error(`Error sending email verification: ${error.message}`);
      throw error;
    }
  }

  private isRecentlySent(timestamp: Date): boolean {
    if (!timestamp) {
      return false;
    }
    const minutesElapsed = (new Date().getTime() - new Date(timestamp).getTime()) / 60000;
    return minutesElapsed < 15;
  }

  private generateEmailToken(): string {
    return (Math.floor(Math.random() * 9000000) + 1000000).toString();
  }

  async findEmailConfirmationWithToken(token: string): Promise<VerificationToken | null> {
    try {
      return await this.emailRepository.findByToken(token);
    } catch (error) {
      this.logger.error(`Error finding email confirmation: ${error.message}`);
      throw error;
    }
  }
}