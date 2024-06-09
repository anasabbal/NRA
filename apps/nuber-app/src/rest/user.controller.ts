import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "../services/user-service";
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GetUserEvent } from "@app/common/user/event/user.get";
import { UserTypeDto } from "@app/common/user/event/user.type.dto";




@Controller('users')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<any[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User by id' })
  async getUserById(@Param('id') userId: string): Promise<GetUserEvent> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
  @Get('type/:id')
  @ApiOperation({ summary: 'Get User Type by id' })
  async getUserTypeById(@Param('id') userTypeById: string): Promise<UserTypeDto> {
    const user = await this.userService.findUserTypeById(userTypeById);
    if (!user) {
      throw new NotFoundException(`User type with ID ${userTypeById} not found`);
    }
    return user;
  }
  @Get('profile')
  @ApiOperation({ summary: 'Get current user' })
  async getCurrentUser(): Promise<any> {
    return this.userService.getCurrentProfile();
  }
}