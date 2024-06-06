import { IsEqualTo } from '@app/user-events';
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

  @IsString()
  @IsIn([UserType.DRIVER, UserType.RIDER], { message: 'User type must be either Driver or User' }) // Validation for userType
  userType: UserType;
}