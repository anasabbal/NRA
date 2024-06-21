import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();


export class EmailUtils {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '0', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendVerificationEmail(email: string, emailToken: string): Promise<boolean> {
    const mailOptions = {
      from: `"Company" <${process.env.COMPANY_EMAIL}>`,
      to: email,
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `Hi! <br><br> Thanks for your registration<br><br>` +
            `<a href="${process.env.EMAIL_URL}:${process.env.PORT}/auth/verify/${emailToken}">Click here to activate your account</a>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      return false;
    }
  }
}
