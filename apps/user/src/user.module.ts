import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserType } from './model/user.type';
import { UserTypeController } from './services/user.type.controller';
import { UserTypeService } from './services/user.type.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserType]),
    DatabaseModule.forRoot(
      process.env.DATABASE_URI,
      process.env.DATABASE_NAME,
      process.env.DATABASE_TYPE as 'mongodb' | 'postgres'
    ),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UserController, UserTypeController],
  providers: [UserService, UserTypeService]
})
export class UserModule implements OnModuleInit{

  private readonly logger = new Logger(UserModule.name);

  constructor(
    private readonly userTypeService : UserTypeService
  ) {}
  
    async onModuleInit() {
      try {
        this.logger.log(`Begin init the UserType`);
        await this.seedUserTypes();
      } catch (error) {
        this.logger.error(`Error while init User Type error: ${error}`);
      }
    }
    private async seedUserTypes() {
      this.userTypeService.seedUserTypes();
    }
}
