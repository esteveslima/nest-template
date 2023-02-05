import { Request } from 'express';

export interface ILogInterceptorRequestObject extends Request {
  [lookupKey: string]: any; // extra keys set in the request object, probably by pipes
}
