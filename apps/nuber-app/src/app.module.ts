import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user-service';
import { UserController } from './rest/user.controller';
import { AuthController } from './rest/auth.controller';
import { DriversController } from './rest/driver.controller';
import { DriverService } from './services/driver-service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // port of user-service
        },
      },
      {
        name: 'DRIVER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002, // port of user-service
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, DriversController],
  providers: [UserService, DriverService]
})
export class AppModule {}
