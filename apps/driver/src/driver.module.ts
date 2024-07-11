import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './models/driver.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from '@app/database';


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver]),
    DatabaseModule.forRoot(
      process.env.DATABASE_URI,
      process.env.DATABASE_NAME,
      process.env.DATABASE_TYPE as 'mongodb' | 'postgres'
    ),
    CacheModule.register({
      ttl: 60, // seconds
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule{
  constructor() {
    // call logConnection after database connection is established
    DatabaseModule.logConnection('drivers');
  }
}
