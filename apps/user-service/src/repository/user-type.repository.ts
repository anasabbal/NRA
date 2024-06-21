import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserType, UserTypeDocument } from '../models/user.type';

@Injectable()
export class UserTypeRepository {
  constructor(@InjectModel(UserType.name) private readonly userTypeModel: Model<UserTypeDocument>) {}

  async findById(userTypeId: string): Promise<UserTypeDocument | null> {
    try {
      return await this.userTypeModel.findById(userTypeId).exec();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserTypeDocument[]> {
    try {
      return await this.userTypeModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findByType(type: string): Promise<UserTypeDocument | null> {
    try {
      return await this.userTypeModel.findOne({ type }).exec();
    } catch (error) {
      throw error;
    }
  }

  async createUserType(userType: Partial<UserType>): Promise<UserTypeDocument> {
    try {
      const newUserType = new this.userTypeModel(userType);
      return await newUserType.save();
    } catch (error) {
      throw error;
    }
  }
}
