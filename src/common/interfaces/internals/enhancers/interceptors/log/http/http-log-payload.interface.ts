import { IHttpRequestLogPayload } from './http-request-log-payload.interface';
import { IHttpResponseLogPayload } from './http-response-log-payload.interface';

export interface IHttpLogPayload {
  request: IHttpRequestLogPayload;
  response: IHttpResponseLogPayload;
  details: {
    startTimestamp: number;
    executionTime: number;
    errorStack?: string;
  };
}
