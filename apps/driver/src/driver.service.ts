import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverStatus } from './enums/driver.status';
import { Driver } from './models/driver.entity';



@Injectable()
export class DriverService {

  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) {}

  async createDriver(userId: string): Promise<Driver> {
    this.logger.log(`Begin creating driver with userId: ${userId}`);

    const driverData = this.buildDriverData(userId);

    const savedDriver = await this.driverRepository.save(driverData);

    this.logger.log(`Driver with userId created: ${JSON.stringify(savedDriver)}`);
    return savedDriver;
  }

  private buildDriverData(userId: string): Partial<Driver> {
    return {
      user_id: userId
    };
  }

  async findAllDrivers(): Promise<Driver[]> {
    try {
      return await this.driverRepository.find();
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
