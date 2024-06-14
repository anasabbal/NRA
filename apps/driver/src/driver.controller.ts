import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import { MessagePattern } from '@nestjs/microservices';
import { DriverCreateCmd } from '@app/common/driver/cmd/driver.create.cmd';
import { DriverDto } from '@app/common/driver/event/driver.dto';
import { mapDriversToDtos } from './utils/driver.mapper';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'create'})
  async createDriver(driverCmd: DriverCreateCmd): Promise<string> {
    this.driverService.createDriver(driverCmd);
    return "driver created successfully";
  }

  @MessagePattern({ cmd: 'get_all_driver'})
  async findAllDriver(): Promise<DriverDto[]> {
    const drivers = await this.driverService.findAllDrivers();
    return mapDriversToDtos(drivers);
  }

  @MessagePattern({ cmd: 'get_all_sorted_by_status'})
  async getAllDrivers(): Promise<DriverDto[]> {
    const drivers = await this.driverService.findAllSortedByStatus();
    return mapDriversToDtos(drivers);
  }
}
