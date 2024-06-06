import { UserCreateCommand } from "@app/user-events/user/cmd/user.create.cmd";
import { IsString } from "class-validator";




export class DriverCreateCmd extends UserCreateCommand {


    @IsString()
    licenceNumber: string;

    @IsString()
    carModel: string;

    @IsString()
    carPlateNumber: string;
}