import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { EmailService } from './email/email.service';
import { UserTypeRepository } from './repository/user-type.repository';
import { UserTypeDto } from './utils/user.type.dto';
import { UserCreateCommand } from './command/user.create.cmd';
import { IResponse } from './utils/response';
import { ResponseSuccess } from './utils/response.dto';
import { GetUserEvent } from './utils/user.get';



@Injectable()
export class UserServiceService {

  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTypeRepository: UserTypeRepository,
    private readonly emailService: EmailService
  ) {}

  async seedUserTypes(): Promise<void> {
    try {
      const userTypes = ['Driver', 'User'];

      for (const type of userTypes) {
        await this.seedUserType(type);
      }
    } catch (error) {
      this.logger.error('Error seeding user types:', error);
    }
  }


  private async seedUserType(type: string): Promise<void> {
    try {
      const existingType = await this.userTypeRepository.findByType(type);
      if (!existingType) {
        const userType = await this.userTypeRepository.createUserType({ type });
        this.logger.log(`User type '${type}' seeded successfully.`);
      } else {
        this.logger.debug(`User type '${type}' already exists.`);
      }
    } catch (error) {
      this.logger.error(`Error seeding user type '${type}': ${error.message}`);
    }
  }

  async findUserTypeById(userTypeId: string): Promise<UserTypeDto | null> {
    try {
      const userType = await this.userTypeRepository.findById(userTypeId);
      if (!userType) return null;

      return {
        id: userType.id,
        name: userType.type,
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

  async createUserInstanceAndSave(userType: UserTypeDto | null, command: UserCreateCommand, hashedPassword: string): Promise<User> {
    try {
      if (!userType) {
        throw new Error('User type not found');
      }

      const newUser = {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: hashedPassword,
        userType: { type: userType.name }, // Assuming userType.name is correct for your schema
        verified: false,
      };

      return await this.userRepository.save(newUser);
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
      await this.userRepository.save(user);

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
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}: ${error.message}`);
      throw error;
    }
  }
}