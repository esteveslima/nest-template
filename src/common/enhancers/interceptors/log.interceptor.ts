// Interceptor to log incoming requests and outgoing responses

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ILogPayload } from 'src/common/interfaces/enhancers/interceptors/log/log-payload.interface';
import { IRequestLogPayload } from 'src/common/interfaces/enhancers/interceptors/log/request-log-payload.interface';
import { IResponseLogPayload } from 'src/common/interfaces/enhancers/interceptors/log/response-log-payload.interface';
import { IResolvedError } from 'src/common/interfaces/enhancers/interceptors/resolved-error.interface';
import { getRequestObject } from '../utils/get-request-object';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  protected requestLogPayload: IRequestLogPayload;
  protected responseLogPayload: IResponseLogPayload;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler

    const req = getRequestObject(context);

    // Build request log object
    this.requestLogPayload = {
      http: {
        method: req?.method.toUpperCase(),
        path: `${req?.baseUrl}${req?.route?.path || ''}`,
        payload: {
          headers: req?.headers,
          params: req?.params,
          query: req?.query,
          body: req?.body,
        },
      },
      graphql: {
        path: {
          typename: req.graphQLInfo?.path?.typename.toUpperCase(),
          key: req.graphQLInfo?.path?.key,
        },
        fieldNodes: req.graphQLInfo?.fieldNodes?.map((fieldNode) => ({
          arguments: fieldNode?.arguments?.map((argument) => ({
            name: { value: argument?.name?.value },
            value: { value: argument?.value?.value },
          })),
        })),
      },
      auth: req?.user,
    };

    // Do not log excluded routes
    const excludedRoutes = ['/'];
    if (excludedRoutes.includes(this.requestLogPayload.http.path))
      return next.handle();

    // Saves timestamp before executing handler
    req.startTimestamp = Date.now();

    return next.handle().pipe(
      // Runs AFTER the route handler
      tap({
        next: (result: any) => {
          this.responseLogPayload = {
            statusCode: req.res.statusCode,
            result,
          };

          const logPayload: ILogPayload = {
            request: this.requestLogPayload,
            response: this.responseLogPayload,
            startTimestamp: req.startTimestamp,
            executionTime: Date.now() - req.startTimestamp,
          };

          Logger.log(JSON.stringify(logPayload)); // Stringify logs for better visualization on cloud tools like aws cloudwatch
          req.isRequestLogged = true; // to avoid repeating logs in filters
        },
        error: (error: IResolvedError) => {
          this.responseLogPayload = {
            statusCode: error?.status || 500,
            result: error?.response || error?.stack || error.toString(),
          };

          const logPayload: ILogPayload = {
            request: this.requestLogPayload,
            response: this.responseLogPayload,
            startTimestamp: req.startTimestamp,
            executionTime: Date.now() - req.startTimestamp,
            errorStack: error?.stack,
          };

          Logger.error(JSON.stringify(logPayload));
          req.isRequestLogged = true;
        },
      }),
    );
  }
}

// TODO: check if request/response data shouldn't be logged
// TODO: check if should log all external http requests(with Axios interceptor)
//     - check if should track request id across logs(AsyncLocalStorage)
