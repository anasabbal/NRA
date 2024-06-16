import { NestFactory } from '@nestjs/core';
import { DriverModule } from './driver.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';


dotenv.config();

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DriverModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
  );
  await app.listen();
}
bootstrap();
