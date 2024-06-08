import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import { MessagePattern } from '@nestjs/microservices';
import { DriverCreateCmd } from '@app/user-events/driver/cmd/driver.create.cmd';
import { Driver } from './models/driver.schema';
import { DriverDto } from '@app/user-events/driver/event/driver.dto';

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
    return this.driverService.findAllDrivers();
  }
}
