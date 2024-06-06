import { NestFactory } from '@nestjs/core';
import { DriverModule } from './driver.module';

async function bootstrap() {
  const app = await NestFactory.create(DriverModule);
  await app.listen(3002);
}
bootstrap();
