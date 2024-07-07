import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './model/user.entity';
import { UserCreateCommand } from '@libs/shared/src/commands/auth/user.create.cmd';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'createUser' })
  async createUser(command: UserCreateCommand): Promise<User> {
    return this.userService.createUser(command);
  }

  @MessagePattern({ cmd: 'findUserById' })
  async findUserById(id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }
}
