import { Controller } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './models/user.schema';
import { GetUserEvent } from '@app/user-events/user/event/user.get';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(userId: string): Promise<GetUserEvent> {
    return await this.userService.getById(userId);
  }
}

