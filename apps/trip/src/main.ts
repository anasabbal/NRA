import { NestFactory } from '@nestjs/core';
import { TripModule } from './trip.module';

async function bootstrap() {
  const app = await NestFactory.create(TripModule);
  await app.listen(3000);
}
bootstrap();
