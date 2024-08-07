import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserService } from '../user.service';
import { User } from '../model/user.entity';
import { UserCreateCommand } from '../command/user.create.cmd';
import { hashPassword } from '../util/hash.pass';



const mockDriverServiceClient = {
  send: jest.fn().mockResolvedValue('Driver created successfully'),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ClientProxy,
          useValue: mockDriverServiceClient,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a new user and call the DriverService', async () => {
      const command: UserCreateCommand = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const hashedPassword = await hashPassword(command.password);
      const mockUser = {
        id: '123',
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: hashedPassword,
      } as User;

      // Mock the repository methods
      userRepository.create = jest.fn().mockReturnValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue(mockUser);
      userRepository.findOne = jest.fn().mockResolvedValue(null); // Ensure no user exists

      const createdUser = await service.createUser(command);

      expect(userRepository.create).toHaveBeenCalledWith({
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(createdUser).toEqual(mockUser);
      expect(mockDriverServiceClient.send).toHaveBeenCalledWith({ cmd: 'create' }, mockUser.id);
    });

    it('should throw an error if the email already exists', async () => {
      const command: UserCreateCommand = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Mock the findOne method to simulate existing user
      userRepository.findOne = jest.fn().mockResolvedValue({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      } as User);

      await expect(service.createUser(command)).rejects.toThrowError();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id and return the user from cache', async () => {
      const userId = '123';
      const mockUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      } as User;

      // Mock the cache manager methods
      const cacheManager = service['cacheManager'];
      cacheManager.get = jest.fn().mockResolvedValue(mockUser);

      // Mock the findOne method (not called in this case)
      userRepository.findOne = jest.fn();

      const user = await service.findUserById(userId);

      expect(cacheManager.get).toHaveBeenCalledWith(`user-${userId}`);
      expect(user).toEqual(mockUser);
      expect(userRepository.findOne).not.toHaveBeenCalled(); // Ensure repository is not called
    });

    it('should find a user by id and store in cache', async () => {
      const userId = '123';
      const mockUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      } as User;

      // Mock the cache manager methods
      const cacheManager = service['cacheManager'];
      cacheManager.get = jest.fn().mockResolvedValue(null); // Simulate no cached user
      cacheManager.set = jest.fn();

      // Mock the findOne method
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const user = await service.findUserById(userId);

      expect(cacheManager.get).toHaveBeenCalledWith(`user-${userId}`);
      expect(cacheManager.set).toHaveBeenCalledWith(`user-${userId}`, mockUser, 600);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if the user is not found', async () => {
      const userId = '123';
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findUserById(userId)).rejects.toThrowError();
    });
  });

  describe('getAll', () => {
    it('should fetch all users and return from cache', async () => {
      const mockUsers = [
        {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        } as User,
      ];

      // Mock the cache manager methods
      const cacheManager = service['cacheManager'];
      cacheManager.get = jest.fn().mockResolvedValue(mockUsers);

      // Mock the find method (not called in this case)
      userRepository.find = jest.fn();

      const users = await service.getAll();

      expect(cacheManager.get).toHaveBeenCalledWith('all-users');
      expect(users).toEqual(mockUsers);
      expect(userRepository.find).not.toHaveBeenCalled(); // Ensure repository is not called
    });

    it('should fetch all users and store in cache', async () => {
      const mockUsers = [
        {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        } as User,
      ];

      // Mock the cache manager methods
      const cacheManager = service['cacheManager'];
      cacheManager.get = jest.fn().mockResolvedValue(null); // Simulate no cached users
      cacheManager.set = jest.fn();

      // Mock the find method
      userRepository.find = jest.fn().mockResolvedValue(mockUsers);

      const users = await service.getAll();

      expect(cacheManager.get).toHaveBeenCalledWith('all-users');
      expect(cacheManager.set).toHaveBeenCalledWith('all-users', mockUsers, 600);
      expect(userRepository.find).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });
});