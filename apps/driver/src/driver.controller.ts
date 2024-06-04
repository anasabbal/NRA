import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  getHello(): string {
    return this.driverService.getHello();
  }
}
