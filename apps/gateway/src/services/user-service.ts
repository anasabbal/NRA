import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserCreateCommand } from '@app/shared/commands/auth/user.create.cmd'; // Adjust import path as needed
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserService {

    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
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
            const result = await this.userClient.send({ cmd: 'findUserById' }, id).toPromise();
            this.logger.info(`Found user with id ${id}`);
            return result;
        } catch (error) {
            this.logger.error(`Error finding user with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            const result = await this.userClient.send({ cmd: 'getAllUsers' }, {}).toPromise();
            this.logger.info(`Fetched all users, count: ${result.length}`);
            return result;
        } catch (error) {
            this.logger.error(`Error fetching all users: ${error.message}`);
            throw error;
        }
    }
}