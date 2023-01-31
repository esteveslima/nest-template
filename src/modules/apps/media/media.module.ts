import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { MediaController } from './adapters/entrypoints/controllers/media.controller';
import { MediaRepository } from './adapters/gateways/databases/repositories/media.repository';
import { MediaResolver } from './adapters/entrypoints/resolvers/media.resolver';
import { UserModule } from '../user/user.module';
import { MediaGraphqlService } from './application/media-graphql.service';
import { MediaEntity } from './adapters/gateways/databases/entities/media.entity';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { MediaEventsHandlerService } from './application/handlers/media-events-handler.service';
import { MediaPubsubSubscriberService } from './adapters/entrypoints/subscribers/media-pubsub-subscriber.service';
import { MediaPubsubPublisherService } from './adapters/gateways/publishers/media-pubsub-publisher.service';
import { MediaRestService } from './application/media-rest.service';

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
    MediaEventsHandlerService,
  ],
  exports: [MediaRestService, MediaGraphqlService],
})
export class MediaModule {}
