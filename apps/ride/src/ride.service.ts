import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ride } from './models/ride.schema';
import { Repository } from 'typeorm';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>
  ){}


  async requestDrive(): Promise<any> {

  }
}
