



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema()
export class Location extends Document {
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