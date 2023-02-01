// Utility function to get request object based on current execution context

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IRequestResolvedAuth } from './resolved-request.interface';

enum enumExecutionContexts {
  HTTP = 'http',
  RPC = 'rpc',
  WS = 'ws',
  GRAPHQL = 'graphql',
}

export const getRequestObject = (
  context: ExecutionContext,
): IRequestResolvedAuth => {
  const contextType = context.getType() as enumExecutionContexts;
  switch (contextType) {
    case enumExecutionContexts.HTTP: {
      const req = context.switchToHttp().getRequest<IRequestResolvedAuth>();

      return req;
    }
    case enumExecutionContexts.GRAPHQL: {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext<{ req: IRequestResolvedAuth }>();

      return req;
    }
    default: {
      const req = context.switchToHttp().getRequest<IRequestResolvedAuth>();
      if (!req) {
        throw new Error(`Invalid request context: ${context}`);
      }

      return req;
    }
  }
};
