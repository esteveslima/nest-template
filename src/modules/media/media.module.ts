import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseConfigModule } from '../database-config/database-config.module';
import { MediaEventsListenersService } from './media-events-listeners.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { MediaResolver } from './graphql/media.resolver';
import { MediaService } from './media.service';
import { UserModule } from '../user/user.module';
import { MediaGraphqlService } from './graphql/media-graphql.service';

@Module({
  imports: [
    // Auth module
    AuthModule,
    // Database module  (//TODO: create dynamic module to config database and typeorm forFeature simultaneously)
    DatabaseConfigModule,
    TypeOrmModule.forFeature([MediaRepository]), // Import ORM Repositories for DI

    // Other feature modules dependencies
    UserModule,
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaEventsListenersService,
    MediaGraphqlService,
    MediaResolver,
  ],
  exports: [MediaService, MediaGraphqlService],
})
export class MediaModule {}
