import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import db from "./db";
import mongoose from "mongoose";




@Module({
    imports: [
      MongooseModule.forRoot(db.uri, {
        dbName: 'rides'
      }),
    ],
  })
  export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);
  
    async onModuleInit() {
      try {
        await mongoose.connect(db.uri);
        this.logger.log('Ride Database connection established');
      } catch (error) {
        this.logger.error(`Ride Database connection error: ${error}`);
      }
    }
  }