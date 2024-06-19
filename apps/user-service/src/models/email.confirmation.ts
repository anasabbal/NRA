import { Schema, SchemaFactory } from "@nestjs/mongoose";



export type EmailConfirmationDocument = EmailConfirmation & Document;


@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })
export class EmailConfirmation {
    email: String;
    emailToken: String;
    timestamp: Date
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);