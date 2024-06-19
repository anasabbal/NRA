import { DriverCreateCmd } from "@app/shared/commands/driver/driver.create.cmd";
import { DriverDto } from "@app/shared/events/driver/driver.dto";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";





@Injectable()
export class DriverService {

    constructor(
        @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ){}


    async createDriver(cmd: DriverCreateCmd): Promise<string> {
        return await this.driverClient.send({ cmd: 'create' }, cmd).toPromise();
    }
    async getDrivers(): Promise<DriverDto[]> {
        try {
            const response = await this.driverClient.send<DriverDto[]>({ cmd: 'get_all_driver' }, {}).toPromise();
            this.logger.log('Drivers fetched successfully');
            return response;
        } catch (error) {
            this.logger.error(`Error fetching drivers: ${error.message}`, error.stack);
            throw new Error('Failed to fetch drivers');
        }
    }
    async getDriverSortedByStatus(): Promise<DriverDto[]> {
        try {
            const response = await this.driverClient.send<DriverDto[]>({ cmd : 'get_all_sorted_by_status'}, {}).toPromise();
            this.logger.log('Drivers fetched successfully');
            return response;
        }catch(error) {
            this.logger.error(`Error fetching drivers: ${error.message}`, error.stack);
            throw new Error('Failed to fetch drivers');
        }
    }
}