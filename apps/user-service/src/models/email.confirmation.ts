import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationTokenDocument = VerificationToken & Document;

@Schema({ timestamps: true })
export class VerificationToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);