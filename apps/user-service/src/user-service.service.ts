import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validating user: ${username}`);
      const user = await this.userModel.findOne({ where: { username } });
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        this.logger.log(`User validated successfully: ${username}`);
        return result;
      }
      this.logger.warn(`Invalid credentials for user: ${username}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${username}`, error.stack);
      throw error;
    }
  }
}
