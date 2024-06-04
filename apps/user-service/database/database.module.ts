import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { ConnectionStates } from 'mongoose';
import mongoConfig from '../src/config/mongo.config';
import { ConnectionOptions } from 'tls';

@Module({
    imports: [
      MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: mongoConfig.uri,
          ...mongoConfig.options,
        }),
      }),
    ],
  })
export class DatabaseModule implements OnModuleInit{

    private readonly logger = new Logger(DatabaseModule.name);

    async onModuleInit() {
        try {
            await mongoose.connect(mongoConfig.uri, mongoConfig.options);
            this.logger.log('Database connection established');
          } catch (error) {
            this.logger.error(`Database connection error: ${error}`);
          }
    }
}
