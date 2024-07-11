import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UserServiceService } from '../user-service.service';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { UserCreateCommand } from '../command/user.create.cmd';
import { IResponse } from '../utils/response';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);


    constructor(
        @Inject(forwardRef(() => UserServiceService))
        private usersService: UserServiceService,
        private jwtService: JwtService
    ){}

    async register(userTypeId: string, command: UserCreateCommand): Promise<IResponse> {
        const errors = await validate(command);
        if (errors.length > 0) {
          throw new BadRequestException(errors);
        }
        try {
          const result = await this.usersService.create(userTypeId, command);
          return result;
        } catch (error) {
          this.logger.error(`Failed to register user: ${command.email}`, error.stack);
          throw error;
        }
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
    async verifyEmail(token: string): Promise<boolean> {
      return this.usersService.verifyUser(token);
    }
}

