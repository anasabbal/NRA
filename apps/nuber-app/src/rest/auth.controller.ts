import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user-service';





@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  
  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any) {
      return this.userService.login(loginUserDto);
  }
  @Get()
  async get(){
    return "Hello Word";
  }
}
