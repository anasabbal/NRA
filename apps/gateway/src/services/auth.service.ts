import { UserService } from "./user-service";
import { DriverService } from "./driver-service";
import { UserTypeService } from "./user.type.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Inject, Injectable, Logger } from "@nestjs/common";





@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly driverService: DriverService,
        private readonly userTypeService: UserTypeService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ){}

    async register(userTypeId: string, cmd: any): Promise<any> {
      try {
        const userType = await this.userTypeService.findUserTypeById(userTypeId);
    
        if (userType.name === 'Driver') {
          return await this.driverService.createDriver(cmd);
        } else if (userType.name === 'User') {
          return await this.userService.createUser(cmd);
        } else {
          throw new Error(`Unknown user type: ${userType.name}`);
        }
      } catch (error) {
        this.logger.error(`Error registering user with userTypeId ${userTypeId}: ${error.message}`);
        throw error;
      }
    }
}