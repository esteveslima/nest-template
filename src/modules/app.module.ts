// Base module, which instantiates other modules

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MediaModule } from './apps/media/media.module';
import { UserModule } from './apps/user/user.module';
import { DBModule } from './setup/db/db.module';
import { EnvModule } from './setup/env/env.module';
import { EventsModule } from './setup/events/events.module';
import { GQLModule } from './setup/gql/gql.module';
import { LogModule } from './setup/log/log.module';

@Module({
  imports: [
    // Setup modules
    EnvModule,
    LogModule,
    DBModule,
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
