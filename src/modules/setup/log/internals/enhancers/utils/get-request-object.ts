// Utility function to get request object based on current execution context

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

enum enumExecutionContexts {
  HTTP = 'http',
  RPC = 'rpc',
  WS = 'ws',
  GRAPHQL = 'graphql',
}

export const getRequestObject = <T>(context: ExecutionContext): T => {
  const contextType = context.getType() as enumExecutionContexts;
  switch (contextType) {
    case enumExecutionContexts.HTTP: {
      const req = context.switchToHttp().getRequest<T>();

      return req;
    }
    case enumExecutionContexts.GRAPHQL: {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext<{ req: T }>();

      return req;
    }
    default: {
      const req = context.switchToHttp().getRequest<T>();
      if (!req) {
        throw new Error(`Invalid request context: ${context}`);
      }

      return req;
    }
  }
};
