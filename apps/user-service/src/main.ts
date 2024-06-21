import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

const logger = new Logger();


async function testSMTPConnection() {
  const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '0'), // parse port to integer
      secure: process.env.EMAIL_SECURE === 'false', // parse secure to boolean
      auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
      }
  });

  try {
      await transporter.verify(); // Verify connection configuration
      logger.log('SMTP connection successful.');
  } catch (error) {
      logger.error('Error connecting to SMTP server:', error);
  }
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    },
  );
  await app.listen();
  testSMTPConnection();
}
bootstrap();
