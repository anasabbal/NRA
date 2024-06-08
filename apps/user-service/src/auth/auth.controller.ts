import { Controller, Logger, Request, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service'; 
import { UserCreateCommand } from '@app/user-events/user/cmd/user.create.cmd';
import { UserLoginCmd } from '@app/user-events/user/cmd/user.login.cmd';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}


    @MessagePattern({ cmd: 'register' })
    async create(payload: { userTypeId: string, command: UserCreateCommand }): Promise<string> {

        const {userTypeId, command} = payload;

        this.logger.log(`userTypeId userTypeId: ${userTypeId}`);
        this.logger.log(`command: ${JSON.stringify(command)}`);
        //this.logger.log(`Received register command for: ${command.email}`);
        await this.authService.register(userTypeId, command); // Assuming register returns a promise
        return "User created successfully";
    }


    @MessagePattern({ cmd: 'login' })
    async login(@Payload() req: UserLoginCmd): Promise<any> {
        this.logger.log(`Logging in user: ${req.email}`);
        return this.authService.login(req);
    }

    @UseGuards(JwtAuthGuard)
    @MessagePattern({cmd: 'profile'})
    async getProfile(@Request() req) :Promise<any>{
        this.logger.log(`Request is: ${req}`);
        return req.user;
    }
}
