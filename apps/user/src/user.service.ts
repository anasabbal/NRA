import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Repository } from 'typeorm';
import { ExceptionPayloadFactory } from '@app/shared/exception/exception.payload.factory';
import { throwException } from '@app/shared/exception/exception.util';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd';
import { hashPassword } from '@app/shared/utils/hash.pass';
import { validateCommand } from '@app/shared/utils/validate';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';



@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name);
  private driverServiceClient: ClientProxy;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.driverServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP, // Choose your transport protocol
      options: {
        port: 3001, // Specify the port of your DriverService
      },
    });
  }


  async createUser(command: UserCreateCommand): Promise<User> {
    await validateCommand(command);
    await this.checkIfEmailExists(command.email);
    const hashedPassword = await hashPassword(command.password);
    const createdUser = await this.saveUser(command, hashedPassword);

    await this.createDriverProxy(createdUser.id);

    return createdUser;
  }
  private async createDriverProxy(userId: string): Promise<void> {
    try {
      const response = await this.driverServiceClient.send<string>({ cmd: 'create' }, userId).toPromise();
      this.logger.log(`Driver created successfully with response: ${response}`);
    } catch (error) {
      this.logger.error('Error creating driver:', error.message);
      throwException(ExceptionPayloadFactory.TECHNICAL_ERROR);
    }
  }
  private async checkIfEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(`User with email ${email} already exists`);
      throwException(ExceptionPayloadFactory.EMAIL_ALREADY_EXIST);
    }
  }
  private async saveUser(command: UserCreateCommand, hashedPassword: string): Promise<User> {
    const { firstName, lastName, email } = command;
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`User created successfully with id ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user:', error.message);
      throwException(ExceptionPayloadFactory.TECHNICAL_ERROR);
    }
  }
  async findUserById(id: string): Promise<User> {
    this.logger.log(`Begin fetching user with id ${id}`);
    const user = await this.userRepository.findOne({ where: {id}});

    if(!user){
      this.logger.error(`User with id ${id} not found`);
      throwException(ExceptionPayloadFactory.USER_NAME_NOT_FOUND);
    }
    this.logger.log(`User fetched successfully with id ${id}`);
    return user;
  }
  async getAll(): Promise<User[]> {
    this.logger.log(`Begin fetching users`);
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error('Error fetching all users:', error.message);
      throw error;
    }
  }
}
