import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseConfigModule } from '../database-config/database-config.module';
import { MediaEventsListeners } from './media-events-listeners';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)
    // Database module
    DatabaseConfigModule,

    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([MediaRepository]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService, 
    MediaEventsListeners,
  ],
})
export class MediaModule {}
