import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('register/:userTypeId')
  async register(@Param('userTypeId') userTypeId: string, @Body() command: any) : Promise<any>{
      return this.authService.register(userTypeId, command);
  }
}
