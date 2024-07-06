import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthController } from './rest/auth.controller';
import { UserController } from './rest/user.controller';
import { DriversController } from './rest/driver.controller';
import { UserService } from './services/user-service';
import { DriverService } from './services/driver-service';
import { AuthService } from './services/auth.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserTypeService } from './services/user.type.service';
import { UserTypeController } from './rest/user.type.controller';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
    }),
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
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3005, // port of user-service
        },
      },
    ]),
    CacheModule.register({
      ttl: 5, // seconds
      max: 100, // maximum number of items in cache
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        })
      ],
    }),
  ],
  controllers: [AuthController, UserController, DriversController, UserTypeController],
  providers: [
    UserService,
    DriverService,
    AuthService,
    UserTypeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class GatewayModule {}
