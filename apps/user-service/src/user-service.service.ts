import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';
import { UserCreateCommand } from '@app/user-events/user/cmd/user.create.cmd';
import { GetUserEvent } from '@app/user-events/user/event/user.get';


@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async create(command: UserCreateCommand): Promise<User> {
    this.logger.log(`Creating user: ${command.email}`);
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const newUser = new this.userModel({ 
      email: command.email, 
      password: hashedPassword, 
      firstName: command.firstName, 
      lastName: command.lastName 
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
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${userId}`, error.stack);
      throw error;
    }
  }
  async getAll(): Promise<GetUserEvent[]> {
    try {
      this.logger.log('Fetching all users');
      return await this.userModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching all users', error.stack);
      throw error;
    }
  }
}
