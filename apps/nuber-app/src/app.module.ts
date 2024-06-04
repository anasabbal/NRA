import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user-service';

@Module({
  imports: [
    ConfigModule.forRoot(), // for environment variables
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3000, // the port where your Auth microservice is running
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
