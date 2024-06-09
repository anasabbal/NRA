import { IsEqualTo } from '@app/common/utils';
import { IsString, IsEmail, MinLength, MaxLength, IsEnum, IsIn } from 'class-validator';




enum UserType {
  DRIVER = 'driver',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export class UserCreateCommand {
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsEqualTo('password', { message: 'Passwords must match' }) // Use the custom validator
  confirmPassword: string;
}