import { Request } from 'express';
import { IAuthUserInfo } from 'src/modules/apps/auth/interfaces/payloads/auth-user-info.interface';
import { IGraphQLInfo } from './log/graphql-info.interface';

export interface IResolvedRequest extends Request {
  user?: IAuthUserInfo; // set by interceptor
  graphQLInfo?: IGraphQLInfo; // set by utility function if context is graphql
  startTimestamp?: number;
  isRequestLogged?: boolean;
}
