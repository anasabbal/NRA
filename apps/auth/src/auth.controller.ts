import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register-auth')
  async register(@Body() command: UserCreateCommand): Promise<any> {
    return this.authService.register(command);
  }
}
