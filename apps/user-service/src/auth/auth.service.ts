import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserServiceService } from '../user-service.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.schema';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserServiceService))
        private usersService: UserServiceService,
        private jwtService: JwtService,
    ){}

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === password) {
          return user;
        }
        return null;
      }
    
      async login(user: User): Promise<{ access_token: string }> {
        const payload: JwtPayload = { username: user.email, sub: user.userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
