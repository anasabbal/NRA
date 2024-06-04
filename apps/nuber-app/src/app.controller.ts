import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services/user-service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  //// Authentication

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any) {
      return this.userService.login(loginUserDto);
  }
}
