// Utility function to get request object based on current execution context

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ILogInterceptorRequestObject } from '../interceptors/types/log-interceptor-request-object.interface';

enum enumExecutionContexts {
  HTTP = 'http',
  RPC = 'rpc',
  WS = 'ws',
  GRAPHQL = 'graphql',
}

export const getRequestObject = (
  context: ExecutionContext,
): ILogInterceptorRequestObject => {
  const contextType = context.getType() as enumExecutionContexts;
  switch (contextType) {
    case enumExecutionContexts.HTTP: {
      const req = context
        .switchToHttp()
        .getRequest<ILogInterceptorRequestObject>();

      return req;
    }
    case enumExecutionContexts.GRAPHQL: {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } =
        gqlContext.getContext<{ req: ILogInterceptorRequestObject }>();

      return req;
    }
    default: {
      const req = context
        .switchToHttp()
        .getRequest<ILogInterceptorRequestObject>();
      if (!req) {
        throw new Error(`Invalid request context: ${context}`);
      }

      return req;
    }
  }
};
