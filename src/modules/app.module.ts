// Base module, which instantiates other modules

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvironmentConfigModule } from './environment-config/environment-config.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Config module
    EnvironmentConfigModule,
    // Feature modules
    MediaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
