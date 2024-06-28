import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { UserService } from '../services/user-service';



@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async findUserById(@Param('id') id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

    @Get()
    async getAllUsers(): Promise<any[]> {
        return this.userService.getAllUsers();
    }

    // Example of handling a POST request to create a user
    @Post()
    async createUser(@Body() command: UserCreateCommand): Promise<any> {
        return this.userService.createUser(command);
    }
}
