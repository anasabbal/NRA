import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';
import { UserCreateCommand } from '@app/user-events/user/cmd/user.create.cmd';
import { GetUserEvent } from '@app/user-events/user/event/user.get';
import { UserType } from './models/user.type';
import { DriverCreateCmd } from '@app/user-events/driver/cmd/driver.create.cmd';
import { UserTypeDto } from '@app/user-events/user/event/user.type.dto';


@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('UserType') private readonly userTypeModel: Model<UserType>
  ) {}

  async seedUserTypes() {
    try {
      const userTypes = ['Driver', 'User'];
  
      if (!this.userTypeModel) {
        throw new Error('userTypeModel is not initialized');
      }
  
      for (const type of userTypes) {
        const existingType = await this.userTypeModel.findOne({ type }).exec();
        if (!existingType) {
          const userType = new this.userTypeModel({ type });
          await userType.save();
        }
      }
    } catch (error) {
      // handle the error appropriately (e.g., log it, throw it, etc.)
      console.error('Error seeding user types:', error);
    }
  }
  async findUserTypeById(userTypeId: string): Promise<UserTypeDto | null> {
    try {
      const userType = await this.userTypeModel.findById(userTypeId).exec();
      const result = {
        id : userType.id,
        name: userType.type
      };
      return result;
    } catch (error) {
      // handle errors (e.g., log error, throw custom exception)
      console.error('Error finding user type by ID:', error);
      return null; // Return null if an error occurs
    }
  }

  async create(userTypeId: string, command: UserCreateCommand | DriverCreateCmd): Promise<User> {
    const userType = await this.findUserTypeById(userTypeId);
    if(userType.name === 'driver'){

    }
    this.logger.log(`Begin creating user: ${command.email}`);
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const newUser = new this.userModel({ 
      email: command.email, 
      password: hashedPassword, 
      firstName: command.firstName, 
      lastName: command.lastName,
      userType: userType
    });
    return await newUser.save();
  }
  async getById(userId: string): Promise<GetUserEvent> {
    try {
      this.logger.log(`Fetching user by ID: ${userId}`);
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        this.logger.warn(`User not found with ID: ${userId}`);
        return null;
      }
      return this.mapUserToGetUserEvent(user);
    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${userId}`, error.stack);
      throw error;
    }
  }
  
  async getAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }
  async mapUserToGetUserEvent(user: User): Promise<GetUserEvent> {
    const getUserEvent = new GetUserEvent();
    getUserEvent.firstName = user.firstName;
    getUserEvent.lastName = user.lastName;
    getUserEvent.email = user.email;
    return getUserEvent;
  }
}
