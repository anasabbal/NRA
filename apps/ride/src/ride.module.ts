import { Module } from '@nestjs/common';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { DatabaseModule } from './databse/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
