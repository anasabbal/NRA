import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user-service';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { DriverCreateCmd } from '@app/shared/commands/driver/driver.create.cmd';
import { AuthService } from '../services/auth.service';
import { IResponse } from '@app/shared/interfaces/response.interface';
import { ResponseSuccess } from '@app/shared/dto/response.dto';






@Controller()
export class AuthController {
  /*constructor(private readonly authService: AuthService) {}


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
  @Get('verify/:token')
  async verifyUser(@Param('token') token: string): Promise<IResponse> {
    try {
      const result = await this.authService.verifyUser(token);
      return new ResponseSuccess("EMAIL_CONFIRMATION.VERIFIED_SUCCESSFULLY");
    } catch (error) {
      throw error;
    }
  }*/
}
