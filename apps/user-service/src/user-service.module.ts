import { Module, forwardRef } from '@nestjs/common';
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
    forwardRef(() =>AuthModule),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService], // Make sure UserServiceService is provided here
  exports: [UserServiceService], // Also, make sure it's exported
})
export class UserServiceModule {}
