import { Provider } from '@nestjs/common';
import * as redis from 'redis';
import { REDIS_CLIENT_PROVIDER } from '../constants';

type TypeRedisClientProviderConfig = Parameters<typeof redis.createClient>[0];
export type TypeRedisClientProvider = ReturnType<typeof redis.createClient>;

export const RedisClientCustomProvider = {
  registerAsync: (
    configBuilder: () => Promise<TypeRedisClientProviderConfig>,
  ): Provider<TypeRedisClientProvider> => ({
    provide: REDIS_CLIENT_PROVIDER,
    useFactory: async () => {
      const config = await configBuilder();

      const client = redis.createClient(config);
      await client.connect();

      return client;
    },
  }),
};
