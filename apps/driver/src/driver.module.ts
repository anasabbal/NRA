import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { Driver, DriverSchema } from './models/driver.schema';
import { LocationSchema, Location } from './models/location.schema';
import { VehicleSchema, Vehicle } from './models/vehicle.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Driver.name, schema: DriverSchema },
        { name: Location.name, schema: LocationSchema },
        { name: Vehicle.name, schema: VehicleSchema }
      ]
    ), 
    DatabaseModule.forRoot(process.env.MONGODB_URI, 'drivers'),
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
