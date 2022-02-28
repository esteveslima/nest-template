// Vars configuration encapsulation in a module

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../../../assets/environment/.env`, // env files used only for development environment
      // ignoreEnvFile: true  // on production environment, .env files must not be used and env variables must be provided by the infrastrcuture
    }),
  ],
  exports: [ConfigModule],
})
export class EnvironmentConfigModule {}
