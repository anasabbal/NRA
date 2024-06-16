import { Module, DynamicModule, Logger } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConnectOptions } from 'mongoose';

@Module({})
export class DatabaseModule {

  private static logger = new Logger(DatabaseModule.name);

  static forRoot(uri: string, dbName: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(uri, {
          dbName,
        } as ConnectOptions),
      ],
      exports: [MongooseModule],
    };
  }

  static forFeature(schemas: { name: string; schema: any }[], connectionName: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forFeature(schemas, connectionName),
      ],
      exports: [MongooseModule],
    };
  }
  static logConnection(dbName: string, error?: any) {
    if (error) {
      this.logger.error(`Failed to connect to database '${dbName}': ${error.message}`, error.stack);
    } else {
      this.logger.log(`Connected to database '${dbName}' successfully.`);
    }
  }
}
