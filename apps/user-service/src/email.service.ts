import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { EmailConfirmation } from "./models/email.confirmation";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(
        @InjectModel('EmailConfirmation') private readonly emailConfirmationModel: Model<EmailConfirmation>
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
            throw error; // Re-throw the error to propagate it up the call stack
        }
    }

    async sendEmailVerification(email: string): Promise<boolean> {
      try {
          const model = await this.findEmailVerification(email);
          /*if (!model || !model.emailToken) {
              throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
          }*/
          this.logger.debug(`Email Token : ${model.emailToken}`);
  
          const sent = await this.sendVerificationEmail(email, model.emailToken);
          if (sent) {
              this.logger.debug(`Email verification sent to ${email}`);
          } else {
              this.logger.warn(`Failed to send email verification to ${email}`);
          }
          return sent;
      } catch (error) {
          this.logger.error(`Error sending email verification: ${error.message}`);
          throw error; // Re-throw the error to propagate it up the call stack
      }
    }
  

    private async findEmailVerification(email: string): Promise<EmailConfirmation | null> {
        return await this.emailConfirmationModel.findOne({ email: email }).exec();
    }

    private isRecentlySent(timestamp: Date): boolean {
        if (!timestamp) {
            return false; // Return false if timestamp is undefined or null
        }
        const minutesElapsed = (new Date().getTime() - timestamp.getTime()) / 60000;
        return minutesElapsed < 15;
    }

    private async updateOrCreateEmailVerification(email: string): Promise<void> {
        try {
            // Generate a new email token
            const emailToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();

            // Use findOneAndUpdate with upsert: true, and ensure to only update existing properties
            await this.emailConfirmationModel.findOneAndUpdate(
                { email: email },
                {
                    emailToken: emailToken,
                    timestamp: new Date()
                },
                {
                    upsert: true, // Create new document if email does not exist
                    new: true,    // Return updated document if upserted
                    setDefaultsOnInsert: true, // Ensure default values are set on insert
                    strict: false // Allow fields not in schema (if needed)
                }
            ).exec();

            this.logger.debug(`Email verification record updated or created for ${email}`);
        } catch (error) {
            this.logger.error(`Error updating or creating email verification: ${error.message}`);
            throw error; // Re-throw the error to propagate it up the call stack
        }
    }

    private async sendVerificationEmail(email: string, emailToken: string): Promise<boolean> {
      const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '0'), // parse port to integer
          secure: process.env.EMAIL_SECURE === 'true', // parse secure to boolean
          auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
          }
      });
  
      const mailOptions = {
          from: `"Company" <${process.env.COMPANY}>`,
          to: email,
          subject: 'Verify Email',
          text: 'Verify Email',
          html: `Hi! <br><br> Thanks for your registration<br><br>` +
              `<a href=${process.env.EMAIL_URL}:${process.env.PORT}/auth/verify/${emailToken}>Click here to activate your account</a>`
      };
      this.logger.debug(`Payload send ${mailOptions.html}`);
  
      try {
          const info = await transporter.sendMail(mailOptions);
          this.logger.debug(`Message sent: ${info.messageId}`);
          return true;
      } catch (error) {
          this.logger.error(`Error sending email: ${error.message}`);
          return false;
      }
    }  
}
