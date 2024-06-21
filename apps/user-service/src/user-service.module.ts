import { Logger, Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import forFeatureDb from './auth/config/for-feature.db';
import { DatabaseModule } from '@app/database';
import * as dotenv from 'dotenv';
import { EmailService } from './email/email.service';
import { UserRepository } from './repository/user.repository';
import { EmailVerificationRepository } from './repository/email.repository';
import { UserTypeRepository } from './repository/user-type.repository';
import { EmailUtils } from './email/utils';

dotenv.config();


@Module({
  imports: [
    MongooseModule.forFeature(forFeatureDb),
    DatabaseModule.forRoot(process.env.MONGODB_URI, 'user'),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService, EmailService, UserRepository, EmailVerificationRepository, UserTypeRepository, EmailUtils],
  exports: [UserServiceService],
})
export class UserServiceModule implements OnModuleInit{

  private readonly logger = new Logger(UserServiceModule.name);

  constructor(
    private readonly userService : UserServiceService
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
      this.userService.seedUserTypes();
    }
}
