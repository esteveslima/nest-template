import { request } from 'express';
import { IAuthUserInfo } from 'src/modules/apps/auth/interfaces/payloads/auth-user-info.interface';
import { IGraphQLInfo } from './graphql-info.interface';

export interface IRequestLogPayload {
  http: {
    method: string;
    path: string;
    payload: {
      headers: typeof request.headers;
      params: typeof request.params;
      query: typeof request.query;
      body: typeof request.body;
    };
  };
  graphql?: IGraphQLInfo;
  auth: IAuthUserInfo;
}
