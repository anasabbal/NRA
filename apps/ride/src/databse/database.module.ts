import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";




@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            password: 'postgres',
            username: 'postgres',
            entities: [],
            database: 'ride',
            synchronize: true,
            logging: true,
        })
    ],
})
export class DatabaseModule {}