import { request } from 'express';
import { IGraphQLRequestInfo } from 'src/common/interfaces/internals/enhancers/interceptors/graphql-request-info.interface';
import { IAuthUserInfo } from 'src/modules/apps/auth/interfaces/payloads/auth-user-info.interface';

export interface IHttpRequestLogPayload {
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
  auth: IAuthUserInfo;
  graphqlInfo?: IGraphQLRequestInfo;
}
