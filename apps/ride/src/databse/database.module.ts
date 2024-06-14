import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import db from "./db";
import mongoose from "mongoose";




@Module({
    imports: [
      MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: db.uri,
        }),
      }),
    ],
  })
  export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);
  
    async onModuleInit() {
      try {
        await mongoose.connect(db.uri);
        this.logger.log('Driver Database connection established');
      } catch (error) {
        this.logger.error(`Driver Database connection error: ${error}`);
      }
    }
  }