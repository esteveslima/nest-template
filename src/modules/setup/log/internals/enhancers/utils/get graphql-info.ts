import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IGraphQLRequestInfo } from '../interceptors/types/graphql-request-info.interface';

export const getGraphqlInfo = (
  context: ExecutionContext,
): IGraphQLRequestInfo => {
  if ((context.getType() as string) !== 'graphql') {
    return undefined;
  }

  const gqlContext = GqlExecutionContext.create(context);
  const graphQLInfo = gqlContext.getInfo<IGraphQLRequestInfo>();

  return graphQLInfo;
};
