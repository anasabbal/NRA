import { Inject, Logger, Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from './config/for-feature.db';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature(forFeatureDb),
    DatabaseModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService], // Provided here
  exports: [UserServiceService], // Also exported here
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
