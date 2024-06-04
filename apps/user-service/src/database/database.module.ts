import { Logger, Module, OnModuleInit } from '@nestjs/common';
import mongoConfig from '../config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Module({
    imports: [
      MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: mongoConfig.uri
        }),
      }),
    ],
  })
  export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);
  
    async onModuleInit() {
      try {
        await mongoose.connect(mongoConfig.uri);
        this.logger.log('Database connection established');
      } catch (error) {
        this.logger.error(`Database connection error: ${error}`);
      }
    }
  }
