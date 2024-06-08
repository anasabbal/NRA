import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DriverStatus } from './driver.status';


export class DriverDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(DriverStatus)
  driverStatus: DriverStatus;
}
