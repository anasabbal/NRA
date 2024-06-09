import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user-service';
import { DriverCreateCmd } from "@app/common/driver/cmd/driver.create.cmd";
import { UserCreateCommand } from "@app/common/user/cmd/user.create.cmd";






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
