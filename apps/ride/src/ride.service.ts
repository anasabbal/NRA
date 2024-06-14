import { Injectable } from '@nestjs/common';
import { Ride } from './models/ride.schema';
import { RequestDriver } from '@app/common/ride/cmd/request.driver';




@Injectable()
export class RideService {
  constructor(

  ){}



  async requestDrive(request: RequestDriver): Promise<any> {

  }
}
