import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import { MessagePattern } from '@nestjs/microservices';
import { DriverCreateCmd } from '@app/user-events/driver/cmd/driver.create.cmd';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'create-driver'})
  async createDriver(driverCmd: DriverCreateCmd): Promise<string> {
    this.driverService.createDriver(driverCmd);
    return "driver Created successfully";
  }
}
