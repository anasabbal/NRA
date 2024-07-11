import { Injectable } from '@nestjs/common';
import { Ride } from './models/ride.schema';




@Injectable()
export class RideService {
  constructor(

  ){}



  getHello(): string {
    return 'Hello World!';
  }
}
