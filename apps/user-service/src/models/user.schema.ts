import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType, UserTypeSchema } from './user.type';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  save(): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: UserTypeSchema })
  userType: UserType;
  
  @Prop({ type: Object, default: {} }) 
  auth: {
    email: { valid: boolean }
  };
}

export const UserSchema = SchemaFactory.createForClass(User);