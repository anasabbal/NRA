import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user-service';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { DriverCreateCmd } from '@app/shared/commands/driver/driver.create.cmd';






@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}


  @Post('register/:userTypeId')
  async register(@Body() createUserDto: UserCreateCommand | DriverCreateCmd,
                 @Param('userTypeId') userTypeId: string
                ) {
    return this.userService.register(userTypeId,createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any) {
      return this.userService.login(loginUserDto);
  }
}
