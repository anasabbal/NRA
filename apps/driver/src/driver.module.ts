import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { Driver, DriverSchema } from './models/driver.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    DatabaseModule,
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
