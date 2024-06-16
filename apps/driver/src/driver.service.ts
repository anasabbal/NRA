import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Driver } from './models/driver.schema';
import { DriverStatus } from './enums/driver.status';
import { DriverCreateCmd } from '@app/shared/commands/driver/driver.create.cmd';

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
  async findAllDrivers(): Promise<Driver[]> {
    try {
      return await this.driverModel.find().exec();
    } catch (error) {
      this.logger.error(`Error while fetching drivers from database: ${error.message}`);
      throw error;
    }
  }

  async findAllSortedByStatus(): Promise<Driver[]> {

    try {
      const drivers = await this.findAllDrivers();
      const order = [
        DriverStatus.EMPTY,
        DriverStatus.ONE_SET_AVAILABLE,
        DriverStatus.TWO_SET_AVAILABLE,
        DriverStatus.THREE_SET_AVAILABLE,
      ];
      const sortedDrivers = this.sortDriversByStatus(drivers, order);

      return sortedDrivers;
    } catch (error) {
      this.logger.error(`Error while fetching and sorting drivers: ${error.message}`);
      throw error;
    }
  }
  private sortDriversByStatus(drivers: Driver[], order: DriverStatus[]): Driver[] {
    try {
      // create a custom sort function based on the order array
      const sortFn = (a: Driver, b: Driver) => {
        const indexA = order.indexOf(a.driverStatus);
        const indexB = order.indexOf(b.driverStatus);
        return indexA - indexB;
      };

      // Sort drivers using the custom sort function
      return drivers.sort(sortFn);
    } catch (error) {
      this.logger.error(`Error while sorting drivers by status: ${error.message}`);
      throw error;
    }
  }

  
}
