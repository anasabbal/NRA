import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema()
export class UserType {
  @Prop({ required: true })
  type: string;
}

export type UserTypeDocument = UserType & Document;

export const UserTypeSchema = SchemaFactory.createForClass(UserType);
