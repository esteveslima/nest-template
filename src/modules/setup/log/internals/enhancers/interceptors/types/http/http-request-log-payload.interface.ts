import { request } from 'express';
import { IGraphQLRequestInfo } from '../graphql-request-info.interface';

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
  graphQLInfo?: IGraphQLRequestInfo;

  [lookupKey: string]: any; // extra keys to lookup for logs
}
