import { Controller, Get, Param } from '@nestjs/common';
import { UserTypeService } from '../services/user.type.service';
import { UserTypeDto } from '@app/shared/events/user/user.type.dto';



@Controller('user-type')
export class UserTypeController {

    
    constructor(private readonly userTypeService: UserTypeService) {}

    @Get(':id')
    async getUserTypeById(@Param('id') id: string): Promise<UserTypeDto> {
        return this.userTypeService.findUserTypeById(id);
    }

    @Get()
    async getAllUserTypes(): Promise<UserTypeDto[]> {
        return this.userTypeService.getUserTypes();
    }
}
