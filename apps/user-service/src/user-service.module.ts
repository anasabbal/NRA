import { Module, forwardRef } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from './config/for-feature.db';


@Module({
  imports: [
    MongooseModule.forFeature(forFeatureDb),
    DatabaseModule],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
