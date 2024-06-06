import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service'; 
import { User } from '../models/user.schema';
import { UserCreateCommand } from '@app/user-events/user/cmd/user.create.cmd';
import { UserLoginCmd } from '@app/user-events/user/cmd/user.login.cmd';

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
}
