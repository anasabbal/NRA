import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerificationToken, VerificationTokenDocument } from '../models/email.confirmation';

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationTokenDocument>,
  ) {}

  async findByEmail(email: string): Promise<VerificationToken | null> {
    try {
      return await this.verificationTokenModel.findOne({ email }).exec();
    } catch (error) {
      throw new Error(`Error finding email verification by email ${email}: ${error.message}`);
    }
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    try {
      return await this.verificationTokenModel.findOne({ token }).exec();
    } catch (error) {
      throw new Error(`Error finding email verification by token ${token}: ${error.message}`);
    }
  }

  async upsertVerificationToken(email: string, token: string, timestamp: Date): Promise<void> {
    try {
      const filter = { email };
      const update = { token, timestamp };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      await this.verificationTokenModel.findOneAndUpdate(filter, update, options).exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteByEmail(email: string): Promise<void> {
    try {
      await this.verificationTokenModel.deleteOne({ email }).exec();
    } catch (error) {
      throw new Error(`Error deleting email verification for ${email}: ${error.message}`);
    }
  }
}
