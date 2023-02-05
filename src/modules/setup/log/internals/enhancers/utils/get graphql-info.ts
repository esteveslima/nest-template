import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ILogPayloadGraphQLInfo } from '../../../types/graphql/log-payload-graphql-info.interface';

export const getGraphqlInfo = (
  context: ExecutionContext,
): ILogPayloadGraphQLInfo => {
  if ((context.getType() as string) !== 'graphql') {
    return undefined;
  }

  const gqlContext = GqlExecutionContext.create(context);
  const graphQLInfo = gqlContext.getInfo<ILogPayloadGraphQLInfo>();

  return graphQLInfo;
};
