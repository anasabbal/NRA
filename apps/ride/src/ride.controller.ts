import { Controller, Get } from '@nestjs/common';
import { RideService } from './ride.service';

@Controller()
export class RideController {
  constructor(private readonly rideService: RideService) {}

  
}
