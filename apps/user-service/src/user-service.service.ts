import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';
import { UserTypeDto } from '@app/shared/events/user/user.type.dto';
import { GetUserEvent } from '@app/shared/events/user/user.get';
import { UserType } from './models/user.type';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { EmailService } from './email.service';
import { ResponseSuccess } from '@app/shared/dto/response.dto';
import { IResponse } from '@app/shared/interfaces/response.interface';
import { UserRepository } from './repository/user.repository';



@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserType.name) private readonly userTypeModel: Model<UserType>,
    private readonly emailService: EmailService
  ) {}

  async seedUserTypes() {
    try {
      const userTypes = ['Driver', 'User'];
  
      if (!this.userTypeModel) {
        throw new Error('userTypeModel is not initialized');
      }
  
      for (const type of userTypes) {
        await this.seedUserType(type);
      }
    } catch (error) {
      this.logger.error('Error seeding user types:', error);
    }
  }

  private async seedUserType(type: string): Promise<void> {
    const existingType = await this.userTypeModel.findOne({ type }).exec();
    if (!existingType) {
      const userType = new this.userTypeModel({ type });
      await userType.save();
      this.logger.log(`User type '${type}' seeded successfully.`);
    } else {
      this.logger.debug(`User type '${type}' already exists.`);
    }
  }

  async findUserTypeById(userTypeId: string): Promise<UserTypeDto | null> {
    try {
      const userType = await this.userTypeModel.findById(userTypeId).exec();
      if (!userType) return null;

      return {
        id: userType.id,
        name: userType.type
      };
    } catch (error) {
      this.logger.error(`Error finding user type by ID: ${error.message}`);
      return null;
    }
  }

  async create(userTypeId: string, command: UserCreateCommand): Promise<IResponse> {
    try {
      const userType = await this.findUserTypeById(userTypeId);
      const hashedPassword = await this.hashPassword(command.password);
      const newUser = await this.createUserInstanceAndSave(userType, command, hashedPassword);

      await this.sendVerificationEmail(newUser.email);

      return new ResponseSuccess('User registered successfully');
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createUserInstanceAndSave(userType: UserTypeDto, command: UserCreateCommand, hashedPassword: string): Promise<User> {
    try {
      const newUser = new this.userModel({
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: hashedPassword,
        userType: { type: userType.name },
        verified: false,
      });

      const savedUser = await newUser.save();
      this.logger.log(`User '${savedUser.email}' created successfully.`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating and saving user: ${error.message}`);
      throw error;
    }
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    try {
      await this.emailService.createEmailToken(email);
      const sent = await this.emailService.sendEmailVerification(email);

      if (!sent) {
        this.logger.warn(`Failed to send verification email to ${email}`);
        throw new Error('Failed to send verification email');
      }

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending verification email: ${error.message}`);
      throw error;
    }
  }

  async verifyUser(token: string): Promise<boolean> {
    try {
      const emailConfirmation = await this.emailService.findEmailConfirmationWithToken(token);

      if (!emailConfirmation || !emailConfirmation.email) {
        this.logger.error(`No valid email confirmation found for token ${token}`);
        throw new HttpException('Invalid email confirmation token', HttpStatus.FORBIDDEN);
      }

      const user = await this.findUserByEmail(emailConfirmation.email);

      if (!user) {
        this.logger.error(`User not found for email ${emailConfirmation.email}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.verified = true;
      await user.save();

      this.logger.log(`User '${emailConfirmation.email}' verified successfully.`);
      return true;
    } catch (error) {
      this.logger.error(`Error verifying user: ${error.message}`);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }

  async getById(userId: string): Promise<GetUserEvent> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const message = `User with ID '${userId}' not found`;
        this.logger.error(message);
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      return this.mapUserToGetUserEvent(user);
    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${userId}`, error.stack);
      throw error;
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching all users:', error.message);
      throw error;
    }
  }

  private async mapUserToGetUserEvent(user: User): Promise<GetUserEvent> {
    const getUserEvent = new GetUserEvent();
    getUserEvent.firstName = user.firstName;
    getUserEvent.lastName = user.lastName;
    getUserEvent.email = user.email;
    return getUserEvent;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}: ${error.message}`);
      throw error;
    }
  }
}
