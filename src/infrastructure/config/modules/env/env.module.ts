// Environment varaibles configuration encapsulated in a module

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const relativeRootDir = `${__dirname}/../../../../..`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${relativeRootDir}/assets/environment/.env`, // env files used only for development environment
      // ignoreEnvFile: true  // on production environment, .env files must not be used and env variables must be provided by the infrastrcuture
    }),
  ],
  exports: [ConfigModule],
})
export class EnvModule {}
