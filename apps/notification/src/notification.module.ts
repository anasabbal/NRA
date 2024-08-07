import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    DatabaseModule.forRoot(
      process.env.DATABASE_URI,
      process.env.DATABASE_NAME,
      process.env.DATABASE_TYPE as 'mongodb' | 'postgres'
    ),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
