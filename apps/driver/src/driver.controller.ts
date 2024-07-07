import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import { MessagePattern } from '@nestjs/microservices';
import { Driver } from './models/driver.entity';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'create'})
  async createDriver(userId: string): Promise<string> {
    this.driverService.createDriver(userId);
    return "driver created successfully";
  }

  @MessagePattern({ cmd: 'get_all_driver'})
  async findAllDriver(): Promise<Driver[]> {
    const drivers = await this.driverService.findAllDrivers();
    return drivers;
  }

  @MessagePattern({ cmd: 'get_all_sorted_by_status'})
  async getAllDrivers(): Promise<Driver[]> {
    const drivers = await this.driverService.findAllSortedByStatus();
    return drivers
  }
}
