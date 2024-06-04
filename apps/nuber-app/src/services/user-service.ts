import { Body, Inject, Injectable, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";



@Injectable()
export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    async register(@Body() createUserDto: any) {
        return this.authClient.send({ cmd: 'register' }, createUserDto);
    }

    async login(@Body() loginUserDto: any) {
        return this.authClient.send({ cmd: 'login' }, loginUserDto);
    }
}