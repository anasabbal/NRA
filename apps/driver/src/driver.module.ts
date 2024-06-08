import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import dabaConfig from './utils/daba.config';



@Module({
  imports: [
    MongooseModule.forFeature(dabaConfig),
    DatabaseModule
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
