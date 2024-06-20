import { UserCreateCommand } from "@app/shared/commands/auth/user.create.cmd";
import { DriverCreateCmd } from "@app/shared/commands/driver/driver.create.cmd";
import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UserService } from "./user-service";
import { DriverService } from "./driver-service";





@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        private readonly userService: UserService,
        private readonly driverService: DriverService
    ){}

    async register(userTypeId: string, command: UserCreateCommand | DriverCreateCmd): Promise<string> {
        try {
          const userType = await this.userService.findUserTypeById(userTypeId);
          console.log(`User type with id ${userType.id} found`);
          if(userType.id == userTypeId){
            return await this.userService.createUser(command, userTypeId);
          }else {
            return await this.userService.createUser(command, userTypeId);
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
            const result = await this.userClient.send({ cmd: 'login' }, loginUserDto).toPromise();
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
    async verifyUser(token: string): Promise<any> {
      try {
        const result = await this.userClient.send({ cmd: 'verify-user'}, token).toPromise();
        return result;
      }catch(error){
        throw new InternalServerErrorException('Failed to Verify');
      }
    }
}