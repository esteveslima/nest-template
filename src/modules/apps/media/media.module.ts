import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaEventsListenerService } from './services/domain/events/listeners/media-events-listener.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './services/database/repositories/media.repository';
import { MediaResolver } from './media.resolver';
import { MediaRestService } from './services/domain/media-rest.service';
import { UserModule } from '../user/user.module';
import { MediaGraphqlService } from './services/domain/media-graphql.service';
import { MediaEntity } from './models/media.entity';
import { SINGLE_DB } from 'src/modules/setup/db/constants';

@Module({
  imports: [
    // Auth module
    AuthModule,

    // Import ORM Entities Repositories for DI and select connection by name
    TypeOrmModule.forFeature([MediaEntity], SINGLE_DB),

    // Other feature modules dependencies
    UserModule,
  ],
  controllers: [MediaController],
  providers: [
    // Custom providers

    // Exposable services
    MediaRestService,
    MediaGraphqlService,
    MediaResolver,

    // Internal services
    MediaRepository,
    MediaEventsListenerService,
  ],
  exports: [MediaRestService, MediaGraphqlService],
})
export class MediaModule {}
