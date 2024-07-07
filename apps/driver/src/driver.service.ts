import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverStatus } from './enums/driver.status';
import { Driver } from './models/driver.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';



@Injectable()
export class DriverService {

  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
    this.logger.log('Begin fetching all drivers');

    const cacheKey = 'all-drivers';
    const cachedDrivers = await this.cacheManager.get<Driver[]>(cacheKey);
    
    if (cachedDrivers) {
      this.logger.log('Drivers fetched from cache');
      return cachedDrivers;
    }

    try {
      const drivers = await this.driverRepository.find();
      await this.cacheManager.set(cacheKey, drivers, 600 ); // cache for 10 minutes
      this.logger.log('Drivers fetched from database and cached');
      return drivers;
    } catch (error) {
      this.logger.error(`Error while fetching drivers from database: ${error.message}`);
      throw error;
    }
  }

  async findAllSortedByStatus(): Promise<Driver[]> {
    this.logger.log('Begin fetching and sorting all drivers by status');

    const cacheKey = 'all-drivers-sorted-by-status';
    const cachedSortedDrivers = await this.cacheManager.get<Driver[]>(cacheKey);
    
    if (cachedSortedDrivers) {
      this.logger.log('Sorted drivers fetched from cache');
      return cachedSortedDrivers;
    }

    try {
      const drivers = await this.findAllDrivers();
      const order = [
        DriverStatus.EMPTY,
        DriverStatus.ONE_SET_AVAILABLE,
        DriverStatus.TWO_SET_AVAILABLE,
        DriverStatus.THREE_SET_AVAILABLE,
      ];
      const sortedDrivers = this.sortDriversByStatus(drivers, order);
      await this.cacheManager.set(cacheKey, sortedDrivers, 600 ); // cache for 10 minutes
      this.logger.log('Sorted drivers fetched from database and cached');
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
