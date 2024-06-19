import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { GetUserEvent } from "@app/shared/events/user/user.get";
import { UserTypeDto } from "@app/shared/events/user/user.type.dto";
import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";



@Injectable()
export class UserService {

    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) {}

    async findUserTypeById(userTypeId: string): Promise<UserTypeDto> {
      try {
        const userType = await this.userClient.send({ cmd: 'get_user_type__by_id' }, userTypeId).toPromise();
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
    async createUser(command: UserCreateCommand, userTypeId: string): Promise<string> {
      return await this.userClient.send({ cmd: 'register' }, { userTypeId, command: command }).toPromise();
    }
    async getAll(): Promise<any[]> {
        try {
          // dend the message to the auth client to fetch all users
          const users = await this.userClient.send({ cmd: 'get_all_users'}, null).toPromise();
          
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
            const user = await this.userClient.send({ cmd: 'get_user_by_id' }, userId).toPromise();
            //const target: GetUserEvent = mapDto<any, GetUserEvent>(user);
            return user;
        } catch (error) {
            console.error(`Error occurred while fetching user with ID ${userId}:`, error);
            throw new InternalServerErrorException(`Failed to fetch user with ID ${userId}`);
        }
    }
    async getCurrentProfile() {
      return this.userClient.send({ cmd: 'profile' }, {}).toPromise();
    }
}

