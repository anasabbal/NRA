import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { VerificationTokenDocument, VerificationToken } from './models/email.confirmation';



dotenv.config();

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationTokenDocument>,
  ) {}

  async createEmailToken(email: string): Promise<boolean> {
    try {
      const emailVerification = await this.findEmailVerification(email);

      if (emailVerification && this.isRecentlySent(emailVerification.timestamp)) {
        throw new HttpException('LOGIN.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        await this.updateOrCreateEmailVerification(email);
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
      const model = await this.findEmailVerification(email);
      if (!model || !model.token) {
        throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
      }
      this.logger.debug(`Email Token: ${model.token}`);

      const sent = await this.sendVerificationEmail(email, model.token);
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

  private async findEmailVerification(email: string): Promise<VerificationToken | null> {
    return await this.verificationTokenModel.findOne({ email }).exec();
  }

  private isRecentlySent(timestamp: Date): boolean {
    if (!timestamp) {
      return false;
    }
    const minutesElapsed = (new Date().getTime() - new Date(timestamp).getTime()) / 60000;
    return minutesElapsed < 15;
  }

  private async updateOrCreateEmailVerification(email: string): Promise<void> {
    try {
      const emailToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();

      const filter = { email };
      const update = {
        token: emailToken,
        timestamp: new Date(),
      };
      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      };

      const result = await this.verificationTokenModel.findOneAndUpdate(filter, update, options).exec();
      if (result) {
        this.logger.debug(`Email verification record updated or created for ${email}`);
      } else {
        this.logger.error(`Failed to update or create email verification record for ${email}`);
        throw new Error(`Failed to update or create email verification record for ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error updating or creating email verification: ${error.message}`);
      throw error;
    }
  }

  private async sendVerificationEmail(email: string, emailToken: string): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '0', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Company" <${process.env.COMPANY_EMAIL}>`,
      to: email,
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `Hi! <br><br> Thanks for your registration<br><br>` +
            `<a href="${process.env.EMAIL_URL}:${process.env.PORT}/auth/verify/${emailToken}">Click here to activate your account</a>`,
    };

    this.logger.debug(`Payload sent: ${mailOptions.html}`);

    try {
      const info = await transporter.sendMail(mailOptions);
      this.logger.debug(`Message sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      return false;
    }
  }

  async findEmailConfirmationWithToken(token: string): Promise<VerificationToken | null> {
    try {
      const emailConfirmation = await this.verificationTokenModel.findOne({ token }).exec();
      return emailConfirmation;
    } catch (error) {
      this.logger.error(`Error finding email confirmation: ${error.message}`);
      throw error;
    }
  }
}
