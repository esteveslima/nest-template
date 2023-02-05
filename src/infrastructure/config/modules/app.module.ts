// Base module, which instantiates other modules

import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppControllerEntrypoint } from 'src/adapters/entrypoints/controllers/app-controller.entrypoint';
import { AuthControllerEntrypoint } from 'src/adapters/entrypoints/controllers/auth-controller.entrypoint';
import { MediaControllerEntrypoint } from 'src/adapters/entrypoints/controllers/media-controller.entrypoint';
import { UserControllerEntrypoint } from 'src/adapters/entrypoints/controllers/user-controller.entrypoint';
import { AuthResolverEntrypoint } from 'src/adapters/entrypoints/resolvers/auth-resolver.entrypoint';
import { MediaResolverEntrypoint } from 'src/adapters/entrypoints/resolvers/media-resolver.entrypoint';
import { UserResolverEntrypoint } from 'src/adapters/entrypoints/resolvers/user-resolver.entrypoint';
import { MediaEventSubscriberEntrypoint } from 'src/adapters/entrypoints/subscribers/media-event-subscriber.entrypoint';
import { HashBcryptClientGateway } from 'src/adapters/gateways/clients/hash-bcrypt-client.gateway';
import { LogPinoGateway } from 'src/adapters/gateways/clients/log-pino.gateway';
import { TokenJwtGateway } from 'src/adapters/gateways/clients/token-jwt.gateway';
import { MediaDatabaseModel } from 'src/adapters/gateways/databases/models/media.model';
import { UserDatabaseModel } from 'src/adapters/gateways/databases/models/user.model';
import { MediaDatabaseRepositoryGateway } from 'src/adapters/gateways/databases/repositories/media-database-repository.gateway';
import { UserDatabaseRepositoryGateway } from 'src/adapters/gateways/databases/repositories/user-database-repository.gateway';
import { MediaEventEmmiterPublisherGateway } from 'src/adapters/gateways/publishers/media-event-emmiter-publisher.service';
import { IHashGateway } from 'src/application/interfaces/ports/hash/hash-gateway.interface';
import { ILogGateway } from 'src/application/interfaces/ports/log/log-gateway.interface';
import { IMediaEventPublisherGateway } from 'src/application/interfaces/ports/media-event-publisher/media-event-publisher-gateway.interface';
import { ITokenGateway } from 'src/application/interfaces/ports/token/token-gateway.interface';
import { AuthGraphqlService } from 'src/application/services/auth/auth-graphql.service';
import { AuthRestService } from 'src/application/services/auth/auth-rest.service';
import { MediaGraphqlService } from 'src/application/services/media/media-graphql.service';
import { MediaHandlerService } from 'src/application/services/media/media-handler.service';
import { MediaRestService } from 'src/application/services/media/media-rest.service';
import { UserGraphqlService } from 'src/application/services/user/user-graphql.service';
import { UserInternalService } from 'src/application/services/user/user-internal.service';
import { UserRestService } from 'src/application/services/user/user-rest.service';
import { IMediaGateway } from 'src/domain/repositories/media/media-gateway.interface';
import { IUserGateway } from 'src/domain/repositories/user/user-gateway.interface';
import { BcryptCustomProvider } from 'src/infrastructure/internals/providers/packages/bcrypt.provider';
import { SINGLE_DB } from './db/constants';
import { DBModule } from './db/db.module';
import { EnvModule } from './env/env.module';
import { EventsModule } from './events/events.module';
import { GQLModule } from './gql/gql.module';
import { JwtClientModule } from './jwt-client/jwt-client.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    // Setup modules
    EnvModule,
    EventsModule,
    GQLModule,
    JwtClientModule.setup(),

    DBModule.setup([UserDatabaseModel, MediaDatabaseModel]),

    LogModule.setup({
      controllers: {
        enabled: true,
        config: {
          interceptor: { lookupExtraProperties: ['authData'] },
        },
      },
      // Wrapping log on providers
      providers: [
        ...DBModule.registeredEntities.map((entity) => ({
          context: `database(${entity.name})`,
          providerToken: getRepositoryToken(entity, SINGLE_DB) as string,
        })),
      ],
    }),
  ],
  controllers: [
    AppControllerEntrypoint,
    AuthControllerEntrypoint,
    UserControllerEntrypoint,
    MediaControllerEntrypoint,
  ],
  providers: [
    // Other entry-points
    AuthResolverEntrypoint,
    UserResolverEntrypoint,
    MediaResolverEntrypoint,
    MediaEventSubscriberEntrypoint,

    // Services
    AuthRestService,
    AuthGraphqlService,
    UserRestService,
    UserGraphqlService,
    UserInternalService,
    MediaRestService,
    MediaGraphqlService,
    MediaHandlerService,

    // Gateways
    {
      provide: ILogGateway,
      useClass: LogPinoGateway,
    },
    TokenJwtGateway, // required by nestjs to be used on manual injections in enhancers
    {
      provide: ITokenGateway,
      useClass: TokenJwtGateway,
    },
    {
      provide: IUserGateway,
      useClass: UserDatabaseRepositoryGateway,
    },
    {
      provide: IHashGateway,
      useClass: HashBcryptClientGateway,
    },
    {
      provide: IMediaGateway,
      useClass: MediaDatabaseRepositoryGateway,
    },
    {
      provide: IMediaEventPublisherGateway,
      useClass: MediaEventEmmiterPublisherGateway,
    },

    // Custom Providers
    BcryptCustomProvider,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  // constructor() {}

  async onApplicationBootstrap() {
    Logger.log(`Application bootstrapped!`);
  }
}
