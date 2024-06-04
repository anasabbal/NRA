import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
