import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



export type LocationDocument = Location & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Location {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop({ default: Date.now })
    timestamp: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);