import { DriverDto } from "@app/shared/events/driver/driver.dto";
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

export function mapDriversToDtos(drivers: Driver[]): DriverDto[] {
    return drivers.map(driver => mapDriverToDto(driver));
}