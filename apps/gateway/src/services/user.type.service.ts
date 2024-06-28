import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";




@Injectable()
export class UserTypeService {

    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy
    ) {}

    async findUserTypeById(userTypeId: string): Promise<any> {
        return await this.userClient.send({ cmd: 'get_by_id' }, userTypeId).toPromise();
    }

    async getUserTypes(): Promise<any[]> {
        return await this.userClient.send({ cmd: 'get_all_user_types' }, {}).toPromise();
    }
}