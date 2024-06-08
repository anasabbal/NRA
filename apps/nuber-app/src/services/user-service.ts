import { DriverCreateCmd } from "@app/user-events/driver/cmd/driver.create.cmd";
import { UserCreateCommand } from "@app/user-events/user/cmd/user.create.cmd";
import { GetUserEvent } from "@app/user-events/user/event/user.get";
import { UserTypeDto } from "@app/user-events/user/event/user.type.dto";
import { BadRequestException, Body, ConflictException, Inject, Injectable, InternalServerErrorException, Logger, Post, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";



@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @Inject('USER_SERVICE') private readonly authClient: ClientProxy,
        @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
    ) {}

    async findUserTypeById(userTypeId: string): Promise<UserTypeDto> {
      try {
        const userType = await this.authClient.send({ cmd: 'get_user_type__by_id' }, userTypeId).toPromise();
        this.logger.log(`User type with payload ${JSON.stringify(userType)} found`);
        return userType;
      }catch (error) {
        // log the error for debugging purposes
        console.error('Error occurred during user registration:', error);
        
        // decide how to handle different types of errors
        if (error.response && error.response.status === 409) {
          throw new ConflictException('User with this email already exists');
        } else if (error.response && error.response.status === 400) {
          throw new BadRequestException('Invalid user data provided');
        } else {
          // if the error is unexpected, throw an Internal Server Error
          throw new InternalServerErrorException('Failed to register user');
        }
      }
    }

    async register(userTypeId: string, command: UserCreateCommand | DriverCreateCmd): Promise<string> {
        try {
          const userType = await this.findUserTypeById(userTypeId);
          console.log(`User type with id ${userType.id} found`);
          if(userType.id == userTypeId){
            return await this.driverClient.send({ cmd: 'create' }, command).toPromise();
          }else {
            return await this.authClient.send({ cmd: 'register' }, { userTypeId, command: command }).toPromise();
          }
        } catch (error) {
          // log the error for debugging purposes
          console.error('Error occurred during user registration:', error);
          // decide how to handle different types of errors
          if (error.response && error.response.status === 409) {
            throw new ConflictException('User with this email already exists');
          } else if (error.response && error.response.status === 400) {
            throw new BadRequestException('Invalid user data provided');
          } else {
            // if the error is unexpected, throw an Internal Server Error
            throw new InternalServerErrorException('Failed to register user');
          }
        }
      }
      

    async login(loginUserDto: any): Promise<any> {
        try {
            const result = await this.authClient.send({ cmd: 'login' }, loginUserDto).toPromise();
            return result;
        } catch (error) {
            // log the error for debugging purposes
            console.error('Error occurred during user login:', error);
            
            // decide how to handle different types of errors
            if (error.response && error.response.status === 401) {
                throw new UnauthorizedException('Invalid credentials');
            } else {
                // if the error is unexpected, throw an Internal Server Error
                throw new InternalServerErrorException('Failed to login');
            }
        }
    }
    async getAll(): Promise<any[]> {
        try {
          // dend the message to the auth client to fetch all users
          const users = await this.authClient.send({ cmd: 'get_all_users'}, null).toPromise();
          
          // ensure that the response is an array
          if (!Array.isArray(users)) {
            throw new Error('Received data is not an array');
          }
    
          return users;
        } catch (error) {
          console.error('Error occurred while fetching all users:', error);
          throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async getById(userId: string): Promise<GetUserEvent> {
        try {
            const user = await this.authClient.send({ cmd: 'get_user_by_id' }, userId).toPromise();
            //const target: GetUserEvent = mapDto<any, GetUserEvent>(user);
            return user;
        } catch (error) {
            console.error(`Error occurred while fetching user with ID ${userId}:`, error);
            throw new InternalServerErrorException(`Failed to fetch user with ID ${userId}`);
        }
    }
}
