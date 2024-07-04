import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { UserService } from '../services/user-service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';



@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @CacheKey('findUserById')
    @CacheTTL(10) // cache for 10 seconds
    async findUserById(@Param('id') id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

    @Get()
    @CacheKey('getAllUsers')
    @CacheTTL(30) // cache for 30 seconds
    async getAllUsers(): Promise<any[]> {
        return this.userService.getAllUsers();
    }

    @Post()
    async createUser(@Body() command: UserCreateCommand): Promise<any> {
        return this.userService.createUser(command);
    }
}
