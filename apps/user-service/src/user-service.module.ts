import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
