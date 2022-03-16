import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { MediaController } from './media.controller';
import { MediaRepository } from './services/adapters/database/repositories/media.repository';
import { MediaResolver } from './media.resolver';
import { MediaRestService } from './services/domain/media-rest.service';
import { UserModule } from '../user/user.module';
import { MediaGraphqlService } from './services/domain/media-graphql.service';
import { MediaEntity } from './models/media.entity';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { MediaEventsPubsubHandlerService } from './services/domain/events/pubsub/media-events-pubsub-handler.service';
import { MediaPubsubSubscriberService } from './services/adapters/pubsub/subscribers/media-pubsub-subscriber.service';
import { MediaPubsubPublisherService } from './services/adapters/pubsub/publishers/media-pubsub-publisher.service';

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
    MediaPubsubPublisherService,
    MediaPubsubSubscriberService,
    MediaEventsPubsubHandlerService,
  ],
  exports: [MediaRestService, MediaGraphqlService],
})
export class MediaModule {}
