import { DriverDto } from "@app/user-events/driver/event/driver.dto";
import { Driver } from "../models/driver.schema";

export function mapDriverToDto(driver: Driver): DriverDto {
    const driverDto = new DriverDto();
    
    driverDto.firstName = driver.firstName;
    driverDto.lastName = driver.lastName;
    driverDto.email = driver.email;
    driverDto.password = driver.password;
    driverDto.driverStatus = driver.driverStatus;
  
    return driverDto;
  }