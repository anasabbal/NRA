import { Driver, DriverSchema } from "../models/driver.schema";
import { Location, LocationSchema } from "../models/location.schema";
import { Vehicle, VehicleSchema } from "../models/vehicle.schema";

export default [
    { name: Driver.name, schema: DriverSchema },
    { name: Location.name, schema: LocationSchema },
    { name: Vehicle.name, schema: VehicleSchema }
];