import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './models/driver.entity';


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver]),
    DatabaseModule.forRoot(
      process.env.DATABASE_URI,
      process.env.DATABASE_NAME,
      process.env.DATABASE_TYPE as 'mongodb' | 'postgres'
    ),
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
