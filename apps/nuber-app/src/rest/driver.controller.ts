import { Controller, Get } from "@nestjs/common";
import { DriverService } from "../services/driver-service";
import { DriverDto } from "@app/common/driver/event/driver.dto";




@Controller('drivers')
export class DriversController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  async getAllDrivers(): Promise<DriverDto[]> {
    return this.driverService.getDrivers();
  }
}