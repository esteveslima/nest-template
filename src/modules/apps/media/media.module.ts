import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

import { MediaControllerEntrypoint } from './adapters/entrypoints/controllers/media-controller.entrypoint';
import { MediaDatabaseRepositoryGateway } from './adapters/gateways/databases/repositories/media-database.repository';
import { MediaResolverEntrypoint } from './adapters/entrypoints/resolvers/media-resolver.entrypoint';
import { UserModule } from '../user/user.module';
import { MediaGraphqlService } from './application/media-graphql.service';
import { MediaDatabaseModel } from './adapters/gateways/databases/models/media.model';
import { MediaHandlerService } from './application/handlers/media-handler.service';
import { MediaEventEmmiterPublisherGateway } from './adapters/gateways/publishers/media-event-emmiter-publisher.service';
import { MediaRestService } from './application/media-rest.service';
import { DBModule } from 'src/modules/setup/db/db.module';
import { IMediaGateway } from './domain/repositories/media/media-gateway.interface';
import { IMediaEventPublisherGateway } from './application/interfaces/ports/media-event-publisher/media-event-publisher-gateway.interface';
import { MediaEventSubscriberEntrypoint } from './adapters/entrypoints/subscribers/media-event-subscriber.entrypoint';

@Module({
  imports: [
    // Auth module
    AuthModule,

    // Import ORM Entities Repositories for DI and select connection by name
    DBModule.setup([MediaDatabaseModel]),

    // Other feature modules dependencies
    UserModule,
  ],
  controllers: [MediaControllerEntrypoint],
  providers: [
    // Custom providers

    // Exposable services
    MediaRestService,
    MediaGraphqlService,
    MediaHandlerService,

    // Non-controllers entry-points
    MediaResolverEntrypoint,
    MediaEventSubscriberEntrypoint,

    // Internal services
    {
      provide: IMediaGateway,
      useClass: MediaDatabaseRepositoryGateway,
    },
    {
      provide: IMediaEventPublisherGateway,
      useClass: MediaEventEmmiterPublisherGateway,
    },
  ],
  exports: [MediaRestService, MediaGraphqlService],
})
export class MediaModule {}
