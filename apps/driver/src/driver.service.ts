import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Driver } from './models/driver.schema';
import { DriverStatus } from './enums/driver.status';
import { mapDriverToDto } from './utils/driver.mapper';
import { DriverCreateCmd } from '@app/common/driver/cmd/driver.create.cmd';
import { DriverDto } from '@app/common/driver/event/driver.dto';

@Injectable()
export class DriverService {

  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectModel('Driver') private readonly driverModel: Model<Driver>
  ){}

  async createDriver(driverCmd: DriverCreateCmd): Promise<Driver> {
    this.logger.log(`Begin creating driver with payload: ${JSON.stringify(driverCmd)}`);

    const hashedPassword = await this.hashPassword(driverCmd.password);
    const driverData = this.buildDriverData(driverCmd, hashedPassword);
    
    const savedDriver = await this.saveDriver(driverData);
    
    this.logger.log(`Driver with firstName created: ${JSON.stringify(savedDriver)}`);
    return savedDriver;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private buildDriverData(driverCmd: DriverCreateCmd, hashedPassword: string): Partial<Driver> {
    return {
      email: driverCmd.email,
      password: hashedPassword,
      firstName: driverCmd.firstName,
      lastName: driverCmd.lastName,
      driverStatus: DriverStatus.EMPTY,
    };
  }

  private async saveDriver(driverData: Partial<Driver>): Promise<Driver> {
    const driver = new this.driverModel(driverData);
    return driver.save();
  }

  async findAllDrivers(): Promise<DriverDto[]> {
    const drivers =  await this.driverModel.find().exec();
    return drivers.map(mapDriverToDto);
  }
}
