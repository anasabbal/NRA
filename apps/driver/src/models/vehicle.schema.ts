import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Vehicle {

    @Prop({required: true})
    driverId: string;

    @Prop({required: true})
    model: string;

    @Prop({required: true})
    year: string;

    @Prop({required: true})
    licencePlate: string;

    @Prop({required: true})
    color: string;

    @Prop({ required: true })
    capacity: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);