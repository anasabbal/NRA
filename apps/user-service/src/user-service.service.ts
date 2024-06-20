import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
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
import { EmailConfirmation } from './models/email.confirmation';
import { EmailService } from './email.service';
import { ResponseError, ResponseSuccess } from '@app/shared/dto/response.dto';
import { IResponse } from '@app/shared/interfaces/response.interface';


@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('UserType') private readonly userTypeModel: Model<UserType>,
    @InjectModel('EmailConfirmation') private readonly emailConfirmationModel: Model<EmailConfirmation>,
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

  async create(userTypeId: string, command: UserCreateCommand): Promise<IResponse> {
    try {
        const userType = await this.findUserTypeById(userTypeId);
        const hashedPassword = await this.hashPassword(command.password);
        const newUser = this.createUser(command, hashedPassword, userType);

        // create email token
        await this.emailService.createEmailToken(newUser.email);

        // send email verification
        const sent = await this.emailService.sendEmailVerification(newUser.email);

        if (sent) {
            return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
        } else {
            return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
        }
    } catch (error) {
        // handle any errors appropriately
        console.error("Error creating user:", error);
        return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR"); 
    }
  }
  async verifyUser(token: string): Promise<boolean> {
    const emailVerif = await this.emailConfirmationModel.findOne({ emailToken: token });

    if (emailVerif && emailVerif.email) {
        const user = await this.userModel.findOne({ email: emailVerif.email });

        if (user) {
            user.auth.email.valid = true;
            const savedUser = await user.save();
            if (emailVerif) {
              this.emailConfirmationModel.deleteOne({ _id: emailVerif._id })
            }
            return !!savedUser;
        } else {
            throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
      }
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
  
  private async saveUser(user: User): Promise<User> {
    try {
      const savedUser = await user.save();
      console.log('User saved successfully');
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
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
