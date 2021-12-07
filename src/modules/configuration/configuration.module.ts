// Configuration encapsulation in a module

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const { NODE_ENV } = process.env; // Environment variables expected from the infrastructure or process(may be the only cases where these variables can be read outside classes)

@Module({
  imports: [
    // Custom config
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: `.env.${NODE_ENV}`, // load stage specific .env file
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
