import { UserService } from "../services/user-service";
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';




@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<any[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<any> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}