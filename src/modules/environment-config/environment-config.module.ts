// Configuration encapsulation in a module

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../../../assets/environment/.env`, // env files used only for development environment
      // ignoreEnvFile: true
    }),
  ],
  exports: [ConfigModule],
})
export class EnvironmentConfigModule {}
