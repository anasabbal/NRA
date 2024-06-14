import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Status } from "./status";



export type RideDocument = Ride & Document;


@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Ride {


    @Prop({ type: String })
    driverId: string;

    @Prop({
        type: { type: 'ObjectId', ref: 'Location' }, // referring to Location model
        autopopulate: { select: { '_id': 0 } }, 
    })
    location_pickup: Location;

    @Prop({
        type: { type: 'ObjectId', ref: 'Location' },
        autopopulate: { select: { '_id': 0 } },
    })
    location_destination: Location;

    @Prop({
        type: 'String', 
        enum: Object.values(Status), 
        default: Status.PROCESSING,
    })
    status: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);