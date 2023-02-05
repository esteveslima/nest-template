import { request } from 'express';

export interface ILogPayloadHttpParams {
  headers: typeof request.headers;
  pathParams: typeof request.params;
  queryParams: typeof request.query;
  body: typeof request.body;
}

export interface ILogPayloadHttpResult {
  statusCode: number;
  result: any;
}
