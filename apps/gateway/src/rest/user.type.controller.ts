import { Controller, Get, Param } from '@nestjs/common';
import { UserTypeService } from '../services/user.type.service';



@Controller('user-type')
export class UserTypeController {

    
    constructor(private readonly userTypeService: UserTypeService) {}

    @Get(':id')
    async getUserTypeById(@Param('id') id: string): Promise<any> {
        return this.userTypeService.findUserTypeById(id);
    }

    @Get()
    async getAllUserTypes(): Promise<any[]> {
        return this.userTypeService.getUserTypes();
    }
}
