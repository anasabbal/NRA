import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "../services/user-service";
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GetUserEvent } from "@app/user-events/user/event/user.get";




@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<any[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get by id' })
  async getUserById(@Param('id') userId: string): Promise<GetUserEvent> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}