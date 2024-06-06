import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DriverStatus, DriverStatusType } from "../enums/driver.status";


export type DriverDocument = Driver & Document;


@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Driver {

    @Prop({ required: true})
    licenceNumber: string;

    @Prop({ required: true})
    carModel: string;

    @Prop({ required: true})
    carPlateNumber: string;

    @Prop({
        type: String, 
        enum: [
            DriverStatus.EMPTY, 
            DriverStatus.ONE_SET_AVAILABLE, 
            DriverStatus.TWO_SET_AVAILABLE, 
            DriverStatus.THREE_SET_AVAILABLE
        ]
    })
    driverStatus: DriverStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.pre('save', function (next) {
    if (!DriverStatusType.isValid(this.driverStatus)) {
      next(new Error('Invalid user type'));
    } else {
      next();
    }
  });