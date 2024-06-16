import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DriverStatus, DriverStatusType } from "../enums/driver.status";
import { Types } from "mongoose";


export type DriverDocument = Driver & Document;


@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Driver {

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [Types.ObjectId], ref: 'Vehicle' })
    vehicles: Types.ObjectId[];
    
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

    @Prop({ default: false })
    isActive: boolean;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.pre('save', function (next) {
    if (!DriverStatusType.isValid(this.driverStatus)) {
      next(new Error('Invalid user type'));
    } else {
      next();
    }
  });