import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EmailConfirmation } from "./models/email.confirmation";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();




@Injectable()
export class EmailService {
    constructor(
        @InjectModel('EmailConfirmation') private readonly emailConfirmationModel: Model<EmailConfirmation>
    ){}

    async createEmailToken(email: string): Promise<boolean> {
        var emailVerification = await this.emailConfirmationModel.findOne({email: email}); 
        if (emailVerification && ( (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 < 15 )){
          throw new HttpException('LOGIN.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          var emailVerificationModel = await this.emailConfirmationModel.findOneAndUpdate( 
            {email: email},
            { 
              email: email,
              emailToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //generate 7 digits number
              timestamp: new Date()
            },
            {upsert: true}
          );
          return true;
        }
      }

    async sendEmailVerification(email: string): Promise<boolean> {   
        var model = await this.emailConfirmationModel.findOne({ email: email});
    
        if(model && model.emailToken){
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_HOST, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        
            let mailOptions = {
              from: '"Company" <' + process.env.COMPANY + '>', 
              to: email, // list of receivers (separated by ,)
              subject: 'Verify Email', 
              text: 'Verify Email', 
              html: 'Hi! <br><br> Thanks for your registration<br><br>'+
              '<a href='+ process.env.EMAIL_URL+ ':' + process.env.EMAIL_PORT +'/auth/email/verify/'+ model.emailToken + '>Click here to activate your account</a>'  // html body
            };
        
            var sent = await new Promise<boolean>(async function(resolve, reject) {
              return await transporter.sendMail(mailOptions, async (error, info) => {
                  if (error) {      
                    console.log('Message sent: %s', error);
                    return reject(false);
                  }
                  console.log('Message sent: %s', info.messageId);
                  resolve(true);
              });      
            })
    
            return sent;
        } else {
          throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
        }
      }
}