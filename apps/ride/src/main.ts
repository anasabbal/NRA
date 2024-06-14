import { NestFactory } from '@nestjs/core';
import { RideModule } from './ride.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';




async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RideModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
      },
    },
  );
  await app.listen();
}
bootstrap();
