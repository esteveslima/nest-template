import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseConfigModule } from '../database-config/database-config.module';
import { MediaEventsListenersService } from './media-events-listeners.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';

@Module({
  imports: [
    // Auth module
    AuthModule,
    // Database module  (//TODO: create dynamic module to config database and typeorm forFeature simultaneously)
    DatabaseConfigModule,
    TypeOrmModule.forFeature([MediaRepository]), // Import ORM Repositories for DI

    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([MediaRepository]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaEventsListenersService,
  ],
})
export class MediaModule {}
