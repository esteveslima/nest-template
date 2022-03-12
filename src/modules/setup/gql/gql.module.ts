// Configuration encapsulation in a module

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlComplexityPlugin } from './plugins/complexity.plugin';

const isDevelopmentEnvironment =
  process.env.NODE_ENV && !process.env.NODE_ENV.includes('prod');

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // code-first approach
      sortSchema: true,
      useGlobalPrefix: true,
      introspection: isDevelopmentEnvironment,
      playground: isDevelopmentEnvironment,

      formatError: (error) => {
        // Remove errors stack trace from response
        if (!!error?.extensions?.exception?.stacktrace) {
          error.extensions.exception.stacktrace = undefined;
        }
        return error;
      },
    }),
  ],
  providers: [GraphqlComplexityPlugin],
  exports: [GraphQLModule],
})
export class GQLModule {}
