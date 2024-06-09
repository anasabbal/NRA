import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UserServiceService } from '../user-service.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.schema';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { UserCreateCommand } from '@app/common/user/cmd/user.create.cmd';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);


    constructor(
        @Inject(forwardRef(() => UserServiceService))
        private usersService: UserServiceService,
        private jwtService: JwtService
    ){}

    async register(userTypeId: string, command: UserCreateCommand): Promise<User> {
        const errors = await validate(command);
        if (errors.length > 0) {
          throw new BadRequestException(errors);
        }
        try {
          const newUser = await this.usersService.create(userTypeId, command); // await here
          return newUser;
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
}

