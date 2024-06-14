import { Module } from '@nestjs/common';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { DatabaseModule } from './databse/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './models/ride.schema';
import { LocationSchema, Location } from './models/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ride.name, schema: RideSchema },
      { name: Location.name, schema: LocationSchema }
  ]),
    DatabaseModule
  ],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
