import { Request } from 'express';
import { IAuthUserInfo } from 'src/modules/apps/auth/interfaces/payloads/auth-user-info.interface';
import { IGraphQLRequestInfo } from './graphql-request-info.interface';

export interface IResolvedRequest extends Request {
  user?: IAuthUserInfo; // set by auth guard
  graphQLInfo?: IGraphQLRequestInfo; // set on get req object by context
  startTimestamp?: number; // set by log interceptor
}
