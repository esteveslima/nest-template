// Base module, which instantiates other modules

import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { MediaDatabaseModel } from './apps/media/adapters/gateways/databases/models/media.model';
import { MediaModule } from './apps/media/media.module';
import { UserDatabaseModel } from './apps/user/adapters/gateways/databases/models/user.model';
import { UserModule } from './apps/user/user.module';
import { SINGLE_DB } from './setup/db/constants';
import { DBModule } from './setup/db/db.module';
import { EnvModule } from './setup/env/env.module';
import { EventsModule } from './setup/events/events.module';
import { GQLModule } from './setup/gql/gql.module';
import { LogModule } from './setup/log/log.module';

@Module({
  imports: [
    // Setup modules
    EnvModule,

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
    EventsModule,
    GQLModule,

    // Application modules
    MediaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
