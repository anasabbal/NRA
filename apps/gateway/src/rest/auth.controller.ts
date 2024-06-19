import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user-service';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { DriverCreateCmd } from '@app/shared/commands/driver/driver.create.cmd';
import { AuthService } from '../services/auth.service';






@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register/:userTypeId')
  async register(@Body() createUserDto: UserCreateCommand | DriverCreateCmd,
                 @Param('userTypeId') userTypeId: string
                ) {
    return this.authService.register(userTypeId,createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any) {
      return this.authService.login(loginUserDto);
  }
}
