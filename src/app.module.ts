// Base module, which instantiates other modules

import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Feature modules
    MediaModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
