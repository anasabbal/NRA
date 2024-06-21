import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';
import { UserTypeDto } from '@app/shared/events/user/user.type.dto';
import { GetUserEvent } from '@app/shared/events/user/user.get';
import { UserType } from './models/user.type';
import { ExceptionPayloadFactory, createExceptionPayload } from '@app/shared/exception/exception.payload.factory';
import { BusinessException } from '@app/shared/exception/business.exception';
import { DriverCreateCmd } from '@app/shared/commands/driver/driver.create.cmd';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { EmailService } from './email.service';
import { ResponseError, ResponseSuccess } from '@app/shared/dto/response.dto';
import { IResponse } from '@app/shared/interfaces/response.interface';
import { VerificationToken, VerificationTokenDocument } from './models/email.confirmation';

@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserType.name) private readonly userTypeModel: Model<UserType>,
    @InjectModel(VerificationToken.name) private readonly verificationTokenModel: Model<VerificationTokenDocument>,
    private readonly emailService: EmailService
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
      console.error('Error seeding user types:', error);
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
      console.error('Error finding user type by ID:', error);
      return null;
    }
  }

  async create(userTypeId: string, command: UserCreateCommand): Promise<any> {
    try {
      // Find user type by ID
      const userType = await this.findUserTypeById(userTypeId);
      if (!userType) {
        throw new Error('User type not found');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(command.password, 10);

      // Create a new user instance
      const newUser = new this.userModel({
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: hashedPassword,
        userType: { type: userType.name }, // Assuming userType has a 'name' property
        verified: false, // Optional: set default value for verified
      });

      // Save the user to the database
      await newUser.save();

      // Create email token
      await this.emailService.createEmailToken(newUser.email);

      // Send email verification
      const sent = await this.emailService.sendEmailVerification(newUser.email);

      if (sent) {
        return new ResponseSuccess('User registered successfully');
      } else {
        return new ResponseError('Failed to send verification email');
      }
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error('Failed to create user');
    }
  }

  async verifyUser(token: string): Promise<boolean> {
    const emailConfirmation = await this.emailService.findEmailConfirmationWithToken(token);

    if (!emailConfirmation || !emailConfirmation.email) {
        this.logger.error(`No valid email confirmation found for token ${token}`);
        throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
    }

    this.logger.log(`Email in emailConfirmation: ${emailConfirmation.email}`);
    const user = await this.findUserByEmail(emailConfirmation.email);
    this.logger.log(`User with email ${emailConfirmation.email}: ${user}`);

    if (!user) {
        this.logger.error(`User not found for email ${emailConfirmation.email}`);
        throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    user.verified = true; // Assuming there is a verified field in your user schema
    const savedUser = await user.save();

    if (savedUser) {
        this.logger.log(`Email confirmation object: ${JSON.stringify(emailConfirmation)}`);
       // await this.verificationTokenModel.deleteOne({ _id: emailConfirmation._id });
    }
    return !!savedUser;
  }


  private async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }
  
  private createUser(command: UserCreateCommand | DriverCreateCmd, hashedPassword: string, userType: UserTypeDto | null): User {
    try {
      if (!userType || !userType.name) {
        throw new Error('User type not found');
      }
      const { email, firstName, lastName } = command;
      console.log('Creating user instance');
      return new this.userModel({ email, password: hashedPassword, firstName, lastName, userType });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getById(userId: string): Promise<GetUserEvent> {
    try {
      this.logger.log(`Fetching user by ID: ${userId}`);
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        this.logger.warn(`User not found with ID: ${userId}`);
        const payload = createExceptionPayload(ExceptionPayloadFactory.USER_NAME_NOT_FOUND);
        throw new BusinessException(payload);
      }
      return this.mapUserToGetUserEvent(user);
    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${userId}`, error.stack);
      throw error;
    }
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
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
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }
}
