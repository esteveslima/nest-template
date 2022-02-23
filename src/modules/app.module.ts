// Base module, which instantiates other modules

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Feature modules
    MediaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
