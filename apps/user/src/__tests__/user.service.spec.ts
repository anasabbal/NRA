import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ExceptionPayloadFactory, createExceptionPayload } from '@app/shared/exception/exception.payload.factory';



describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let cacheManager: Cache;
  let clientProxy: ClientProxy;

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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheManager = module.get<Cache>(CACHE_MANAGER);

    // Mock ClientProxyFactory.create
    clientProxy = {
      send: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue('Driver created'),
      }),
    } as any;
    jest.spyOn(ClientProxyFactory, 'create').mockReturnValue(clientProxy);
  });

  describe('createUser', () => {
    it('should create a user and proxy a driver creation', async () => {
      const command = { email: 'test@example.com', password: 'password', firstName: 'Anas', lastName: 'Abbal' , confirmPassword: 'password'};
      jest.spyOn(service, 'checkIfEmailExists').mockResolvedValue(undefined);
      jest.spyOn(service, 'saveUser').mockResolvedValue({ id: '1', ...command } as unknown as User);
      
      const result = await service.createUser(command);

      expect(result).toEqual({ id: '1', ...command });
      expect(service['checkIfEmailExists']).toHaveBeenCalledWith('test@example.com');
      expect(service['saveUser']).toHaveBeenCalledWith(command, expect.any(String));
      expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'create' }, '1');
    });
  });

  describe('findUserById', () => {
    it('should return a user from cache if available', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      jest.spyOn(cacheManager, 'get').mockResolvedValue(user);

      const result = await service.findUserById('1');

      expect(result).toEqual(user);
      expect(cacheManager.get).toHaveBeenCalledWith('user-1');
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return a user from the repository if not in cache', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.findUserById('1');

      expect(result).toEqual(user);
      expect(cacheManager.get).toHaveBeenCalledWith('user-1');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(cacheManager.set).toHaveBeenCalledWith('user-1', user, 600);
    });

    it('should throw USER_NAME_NOT_FOUND exception if user not found', async () => {
        // mock cacheManager to return null, simulating cache miss
        jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
        // mock userRepository to return null, simulating user not found
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        // expect the service method to throw an exception
        await expect(service.findUserById('1')).rejects.toMatchObject(
            createExceptionPayload(ExceptionPayloadFactory.USER_NAME_NOT_FOUND)
        );
        // assert that cacheManager.get was called with the correct key
        expect(cacheManager.get).toHaveBeenCalledWith('user-1');
        // assert that userRepository.findOne was called with the correct id
        expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
    
  });

  describe('getAll', () => {
    it('should return users from cache if available', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(users);

      const result = await service.getAll();

      expect(result).toEqual(users);
      expect(cacheManager.get).toHaveBeenCalledWith('all-users');
      expect(userRepository.find).not.toHaveBeenCalled();
    });

    it('should return users from the repository if not in cache', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.getAll();

      expect(result).toEqual(users);
      expect(cacheManager.get).toHaveBeenCalledWith('all-users');
      expect(userRepository.find).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('all-users', users, 600);
    });

    it('should handle errors during user retrieval', async () => {
      const error = new Error('Database error');
      jest.spyOn(userRepository, 'find').mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow(error);
      expect(cacheManager.get).toHaveBeenCalledWith('all-users');
      expect(userRepository.find).toHaveBeenCalled();
    });
  });
});
