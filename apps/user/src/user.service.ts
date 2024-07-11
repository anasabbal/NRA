import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserCreateCommand } from './command/user.create.cmd';
import { validate } from 'class-validator';
import { hashPassword } from './util/hash.pass';



@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name);
  private driverServiceClient: ClientProxy;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.driverServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP, // Choose your transport protocol
      options: {
        port: 3001, // Specify the port of your DriverService
      },
    });
  }


  async createUser(command: UserCreateCommand): Promise<User> {
    await validate(command);
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
      throw new Error();
    }
  }
  private async checkIfEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(`User with email ${email} already exists`);
      throw new Error();
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
      throw new Error();
    }
  }
  async findUserById(id: string): Promise<User> {
    this.logger.log(`Begin fetching user with id ${id}`);
    
    const cachedUser = await this.cacheManager.get<User>(`user-${id}`);
    if (cachedUser) {
      this.logger.log(`User fetched from cache with id ${id}`);
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: {id}});

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new Error();
    }

    this.logger.log(`User fetched successfully with id ${id}`);
    await this.cacheManager.set(`user-${id}`, user, 600); // cache for 10 minutes
    return user;
  }
  async getAll(): Promise<User[]> {
    this.logger.log(`Begin fetching users`);
    
    const cachedUsers = await this.cacheManager.get<User[]>('all-users');
    if (cachedUsers) {
      this.logger.log(`Users fetched from cache`);
      return cachedUsers;
    }

    try {
      const users = await this.userRepository.find();
      this.logger.log(`Fetched users: ${JSON.stringify(users)}`);
      await this.cacheManager.set('all-users', users, 600 ); // cache for 10 minutes
      return users;
    } catch (error) {
      this.logger.error('Error fetching all users:', error.message);
      throw error;
    }
  }
}