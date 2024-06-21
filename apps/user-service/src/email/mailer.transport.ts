import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

class NodemailerTransporter {
  private static instance: nodemailer.Transporter | null = null;

  private constructor() {} // Prevents instantiation

  static getInstance(): nodemailer.Transporter {
    if (!NodemailerTransporter.instance) {
      NodemailerTransporter.instance = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '0', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return NodemailerTransporter.instance;
  }
}

export default NodemailerTransporter;
