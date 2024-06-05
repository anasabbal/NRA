import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UserServiceService } from '../user-service.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterUserCommand } from './interface/register.command';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);


    constructor(
        @Inject(forwardRef(() => UserServiceService))
        private usersService: UserServiceService,
        private jwtService: JwtService,
    ){}

    async register(req: RegisterUserCommand): Promise<User> {
        const errors = await validate(req);
        if (errors.length > 0) {
          throw new BadRequestException(errors);
        }
        try {
          this.logger.log(`Registering user: ${req.email}`);
          const hashedPassword = await bcrypt.hash(req.password, 10);
          const newUser = await this.usersService.create(req); // await here
          this.logger.log(`User registered successfully: ${req.email}`);
          return newUser;
        } catch (error) {
          this.logger.error(`Failed to register user: ${req.email}`, error.stack);
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

