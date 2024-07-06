import { Controller } from "@nestjs/common";
import { UserTypeService } from "./user.type.service";
import { MessagePattern } from "@nestjs/microservices";
import { UserType } from "../model/user.type";
import { UserTypeDto } from "@app/shared/events/user/user.type.dto";



@Controller('user-type')
export class UserTypeController {

    constructor(
        private readonly userTypeService: UserTypeService
    ){}

    @MessagePattern({ cmd: 'get_by_id'})
    async getUserTypeById(userTypeId: string): Promise<UserTypeDto> {
        return this.userTypeService.findUserTypeById(userTypeId);
    }

    @MessagePattern({ cmd: 'get_all_user_types'})
    async getUserTypes(): Promise<UserTypeDto[]> {
        return this.userTypeService.getUserTypes();
    }
}