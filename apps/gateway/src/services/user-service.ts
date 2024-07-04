import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd'; // Adjust import path as needed
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {

    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async createUser(command: UserCreateCommand): Promise<any> {
        try {
            const result = await this.userClient.send({ cmd: 'createUser' }, command).toPromise();
            this.logger.info(`Created user with id ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }

    async findUserById(id: string): Promise<any> {
        try {
            const cachedUser = await this.cacheManager.get(`user-${id}`);
            if (cachedUser) {
                this.logger.info(`Found user with id ${id} in cache`);
                return cachedUser;
            }

            const result = await this.userClient.send({ cmd: 'findUserById' }, id).toPromise();
            this.logger.info(`Found user with id ${id}`);
            await this.cacheManager.set(`user-${id}`, result, 300); // Cache for 5 minutes
            return result;
        } catch (error) {
            this.logger.error(`Error finding user with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            const cachedUsers = await this.cacheManager.get<any[]>('all-users');
            if (cachedUsers) {
                this.logger.info(`Fetched all users from cache`);
                return cachedUsers;
            }

            const result = await this.userClient.send({ cmd: 'getAllUsers' }, {}).toPromise();
            this.logger.info(`Fetched all users, count: ${result.length}`);
            await this.cacheManager.set('all-users', result, 300); // Cache for 5 minutes
            return result;
        } catch (error) {
            this.logger.error(`Error fetching all users: ${error.message}`);
            throw error;
        }
    }
}
