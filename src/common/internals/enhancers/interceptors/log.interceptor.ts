// Interceptor to log incoming requests and outgoing responses
// Won't include guards/middlewares, check the architectural order for enhancers: https://stackoverflow.com/questions/54863655/whats-the-difference-between-interceptor-vs-middleware-vs-filter-in-nest-js

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IResolvedError } from 'src/common/interfaces/internals/enhancers/interceptors/resolved-error.interface';
import { IResolvedRequest } from 'src/common/interfaces/internals/enhancers/interceptors/resolved-request.interface';
import { getRequestObject } from 'src/common/internals/enhancers/utils/get-request-object';
import { IHttpLogPayload } from '../../../interfaces/internals/enhancers/interceptors/log/http/http-log-payload.interface';
import { IHttpRequestLogPayload } from '../../../interfaces/internals/enhancers/interceptors/log/http/http-request-log-payload.interface';
import { IHttpResponseLogPayload } from '../../../interfaces/internals/enhancers/interceptors/log/http/http-response-log-payload.interface';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler

    const req: IResolvedRequest = getRequestObject(context);

    // Build request log object
    const requestLogPayload: IHttpRequestLogPayload = {
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
      graphqlInfo: {
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
    if (excludedRoutes.includes(requestLogPayload.http.path))
      return next.handle();

    // Saves timestamp before executing handler
    req.startTimestamp = Date.now();

    return next.handle().pipe(
      // Runs AFTER the route handler
      tap({
        next: (result: any) => {
          const responseLogPayload: IHttpResponseLogPayload = {
            statusCode: req.res.statusCode,
            result,
          };

          const httpLogPayload: IHttpLogPayload = {
            request: requestLogPayload,
            response: responseLogPayload,
            details: {
              startTimestamp: req.startTimestamp,
              executionTime: Date.now() - req.startTimestamp,
            },
          };

          Logger.log(httpLogPayload);
        },
        error: (error: IResolvedError) => {
          const responseLogPayload: IHttpResponseLogPayload = {
            statusCode: error?.status || 500,
            result: error?.response || error?.stack || error.toString(),
          };

          const httpLogPayload: IHttpLogPayload = {
            request: requestLogPayload,
            response: responseLogPayload,
            details: {
              startTimestamp: req.startTimestamp,
              executionTime: Date.now() - req.startTimestamp,
              errorStack: error?.stack,
            },
          };

          Logger.error(httpLogPayload);
        },
      }),
    );
  }
}

// TODO: check if request/response data shouldn't be logged
// TODO: check if should log all external http requests(with Axios interceptor)
//     - check if should track request id across logs(AsyncLocalStorage)
