import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const logger = new Logger();
  await app.listen(3001);
  logger.log('Application User Service started !');
}
bootstrap();
