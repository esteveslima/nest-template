import { CacheModule, CacheStore, DynamicModule, Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientCustomProvider } from './internals/providers/packages/redis-client.provider';
import { REDIS_CLIENT_PROVIDER } from './internals/providers/constants';

interface ICacheClientModuleOptions {
  skipConnection?: boolean; // For testing environment
}

@Module({})
export class CacheClientModule {
  static setup(options?: ICacheClientModuleOptions): DynamicModule {
    const module: DynamicModule = {
      module: CacheClientModule,
      imports: [
        CacheModule.registerAsync<RedisClientOptions>({
          isGlobal: false,
          useFactory: async () => ({
            store: redisStore as unknown as CacheStore,
            port: +process.env.CACHE_PORT,
            host: process.env.CACHE_HOST,
            username: process.env.CACHE_USER,
            password: process.env.CACHE_PASS,
            database: +process.env.CACHE_DB,
          }),
        }),
      ],
      providers: [
        RedisClientCustomProvider.registerAsync(async () => ({
          socket: {
            host: process.env.CACHE_HOST,
            port: +process.env.CACHE_PORT,
          },
          username: process.env.CACHE_USER,
          password: process.env.CACHE_PASS,
          database: +process.env.CACHE_DB,
        })),
      ],
      exports: [
        {
          provide: REDIS_CLIENT_PROVIDER,
          useValue: RedisClientCustomProvider,
        },
        CacheModule,
      ],
    };

    if (options?.skipConnection) {
      module.providers.shift(); // remove redis custom provider connection form array(first item)
      module.exports.shift(); // remove provider export form array(first item)
    }

    return module;
  }
}
