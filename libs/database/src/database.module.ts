import { Module, DynamicModule, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';




@Module({})
export class DatabaseModule {
  
  private static logger = new Logger(DatabaseModule.name);

  static forRoot(uri: string, dbName: string, dbType: 'mongodb' | 'postgres'): DynamicModule {
    if (dbType === 'mongodb') {
      return {
        module: DatabaseModule,
        imports: [
          MongooseModule.forRoot(uri, {
            dbName,
          } as MongooseModuleOptions),
        ],
        exports: [MongooseModule],
      };
    } else if (dbType === 'postgres') {
      const typeOrmOptions: TypeOrmModuleOptions = {
        type: 'postgres',
        url: uri,
        database: dbName,
        synchronize: true, // Set to false in production
        autoLoadEntities: true,
      };

      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRoot(typeOrmOptions),
        ],
        exports: [TypeOrmModule],
      };
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static forFeature(
    schemas: { name: string; schema: any }[],
    connectionName: string,
    dbType: 'mongodb' | 'postgres'
  ): DynamicModule {
    if (dbType === 'mongodb') {
      return {
        module: DatabaseModule,
        imports: [
          MongooseModule.forFeature(schemas, connectionName),
        ],
        exports: [MongooseModule],
      };
    } else if (dbType === 'postgres') {
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forFeature(schemas.map(schema => schema.schema)),
        ],
        exports: [TypeOrmModule],
      };
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static logConnection(dbName: string, error?: any) {
    if (error) {
      this.logger.error(`Failed to connect to database '${dbName}': ${error.message}`, error.stack);
    } else {
      this.logger.log(`Connected to database '${dbName}' successfully.`);
    }
  }
}