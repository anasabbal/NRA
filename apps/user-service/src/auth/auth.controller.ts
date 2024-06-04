import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service'; 
import { RegisterUserCommand } from './interface/register.command';
import { User } from '../models/user.schema';
import { LoginCommand } from './interface/login.command';

@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'register' })
    async register(@Payload() registerUserCommand: RegisterUserCommand): Promise<User> {
        this.logger.log(`Received register command for: ${registerUserCommand.email}`);
        return this.authService.register(registerUserCommand);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() req: LoginCommand): Promise<any> {
        this.logger.log(`Logging in user: ${req.email}`);
        return this.authService.login(req);
    }
}
