import { DriverDto } from "@app/common/driver/event/driver.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";





@Injectable()
export class DriverService {

    private readonly logger = new Logger(DriverService.name);

    constructor(
        @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
    ){}


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
}