import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Driver } from './models/driver.schema';
import { DriverCreateCmd } from '@app/user-events/driver/cmd/driver.create.cmd';

@Injectable()
export class DriverService {

  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectModel('Driver') private readonly driverModel: Model<Driver>
  ){}

  async createDriver(driverCmd: DriverCreateCmd): Promise<Driver> {
    this.logger.log(`Begin creating driver with payload : ${driverCmd}`);
    const hashedPassword = await bcrypt.hash(driverCmd.password, 10);
    const driver = new this.driverModel({
      email: driverCmd.email, 
      password: hashedPassword, 
      firstName: driverCmd.firstName, 
      lastName: driverCmd.lastName,
      licenceNumber: driverCmd.licenceNumber,
      carModel: driverCmd.carModel,
      carPlateNumber: driverCmd.carPlateNumber,
      driverStatus: null
    });
    this.logger.log(`Driver with firsName created  : ${driverCmd.firstName}`);
    return await driver.save();
  }
}
