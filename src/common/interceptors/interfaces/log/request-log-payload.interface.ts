import { request } from 'express';
import { IAuthUser } from 'src/modules/auth/interfaces/user/user.interface';
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
  auth: IAuthUser;
}
