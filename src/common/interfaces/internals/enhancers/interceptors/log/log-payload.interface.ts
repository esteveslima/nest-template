import { IRequestLogPayload } from './request-log-payload.interface';
import { IResponseLogPayload } from './response-log-payload.interface';

export interface ILogPayload {
  request: IRequestLogPayload;
  response: IResponseLogPayload;
  startTimestamp: number;
  executionTime: number;
  errorStack?: string;
}
