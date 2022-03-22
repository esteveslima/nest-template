// Utility function to get request object based on current execution context

import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IGraphQLInfo } from '../../../interfaces/internals/enhancers/interceptors/log/graphql-info.interface';
import { IResolvedRequest } from '../../../interfaces/internals/enhancers/interceptors/resolved-request.interface';

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
      req.graphQLInfo = gqlContext.getInfo() as IGraphQLInfo; // Append graphql some info to the request

      return req;
    }
    default: {
      const req = context.switchToHttp().getRequest<IResolvedRequest>();
      if (!req) {
        throw new InternalServerErrorException('Request context not found');
      }

      return req;
    }
  }
};