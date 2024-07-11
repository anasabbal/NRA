import { UserCreateCommand } from './command/create.user.command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        @Inject('USER_SERVICE') private client: ClientProxy
    ){}

    async register(command: UserCreateCommand): Promise<any> {
        const user = await firstValueFrom(this.client.send({ cmd: 'createUser' }, command));
        if(user)
            return user;
        return null;
    }
    async login(user: any) {
        this.logger.log(`Generating JWT token for user: ${user.email}`);
        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);
        this.logger.log(`JWT token generated successfully for user: ${user.email}`);
        return {
          access_token: token,
          email: user.email
        };
    }
}
