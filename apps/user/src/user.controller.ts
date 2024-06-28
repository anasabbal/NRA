import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { User } from './model/user.entity';

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
