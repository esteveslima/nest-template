// Utility function to get request object based on current execution context

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IResolvedRequest } from '../../../types/resolved-request.interface';

enum enumExecutionContexts {
  HTTP = 'http',
  RPC = 'rpc',
  WS = 'ws',
  GRAPHQL = 'graphql',
}

export const getRequestObject = (
  context: ExecutionContext,
): IResolvedRequest => {
  const contextType = context.getType() as enumExecutionContexts;
  switch (contextType) {
    case enumExecutionContexts.HTTP: {
      const req = context.switchToHttp().getRequest<IResolvedRequest>();

      return req;
    }
    case enumExecutionContexts.GRAPHQL: {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext<{ req: IResolvedRequest }>();

      return req;
    }
    default: {
      const req = context.switchToHttp().getRequest<IResolvedRequest>();
      if (!req) {
        throw new Error(`Invalid request context: ${context}`);
      }

      return req;
    }
  }
};
