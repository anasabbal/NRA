import { UserTypeDto } from "@app/shared/events/user/user.type.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";




@Injectable()
export class UserTypeService {



    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ) {}

    async findUserTypeById(userTypeId: string): Promise<UserTypeDto> {
        try {
            return await this.userClient.send({ cmd: 'get_by_id' }, userTypeId).toPromise();
        } catch (error) {
            this.logger.error(`Failed to find user type by ID: ${userTypeId}`, error.stack);
            throw error;
        }
    }

    async getUserTypes(): Promise<UserTypeDto[]> {
        try {
            return await this.userClient.send({ cmd: 'get_all_user_types' }, {}).toPromise();
        } catch (error) {
            this.logger.error('Failed to get user types', error.stack);
            throw error;
        }
    }
}