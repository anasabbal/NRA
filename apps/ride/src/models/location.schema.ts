import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export type LocationDocument = Location & Document;




@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Location {

    @Prop({ type: 'Number' }) 
    latitude: number;

    @Prop({ type: 'Number' }) 
    longitude: number;

    @Prop({ type: 'Number' })
    eta: number; 
}

export const LocationSchema = SchemaFactory.createForClass(Location);