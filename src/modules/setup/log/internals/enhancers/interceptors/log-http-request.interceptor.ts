// Interceptor to log all data from incoming requests and outgoing responses(beware to check if this this data shouldn't be logged)
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

import { getRequestObject } from '../utils/get-request-object';
import { getGraphqlInfo } from '../utils/get graphql-info';
import { IHttpLogPayload } from './types/http/http-log-payload.interface';
import { IHttpRequestLogPayload } from './types/http/http-request-log-payload.interface';
import { IHttpResponseLogPayload } from './types/http/http-response-log-payload.interface';
import { IResolvedLogInterceptorError } from './types/resolved-log-interceptor-error.interface';

interface ILoggerInterceptorOptions {
  excludedRoutes?: string[];
  lookupRequestExtraProperties?: string[];
}

@Injectable()
export class LogHttpRequestInterceptor implements NestInterceptor {
  private readonly options?: ILoggerInterceptorOptions = {
    excludedRoutes: ['/'],
  };

  constructor(loggerInterceptorOptions?: ILoggerInterceptorOptions) {
    // Override default options from custom parameters provided
    Object.keys({ ...loggerInterceptorOptions }).forEach((customOptionKey) => {
      const optionKey = customOptionKey as keyof ILoggerInterceptorOptions;
      const optionValue = loggerInterceptorOptions[optionKey];
      if (!!optionValue) {
        this.options[optionKey] = optionValue;
      }
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler

    const req = getRequestObject(context);
    const graphQLInfo = getGraphqlInfo(context);

    // Build request log object
    const requestLogPayload: IHttpRequestLogPayload = {
      http: {
        method: req?.method?.toUpperCase(),
        path: `${req?.baseUrl}${req?.route?.path || ''}`,
        payload: {
          headers: req?.headers,
          params: req?.params,
          query: req?.query,
          body: req?.body,
        },
      },
      graphQLInfo: graphQLInfo && {
        path: {
          typename: graphQLInfo?.path?.typename?.toUpperCase(),
          key: graphQLInfo?.path?.key,
        },
        fieldNodes: graphQLInfo?.fieldNodes?.map((fieldNode) => ({
          arguments: fieldNode?.arguments?.map((argument) => ({
            name: { value: argument?.name?.value },
            value: { value: argument?.value?.value },
          })),
        })),
      },
    };

    // Lookup for extra properties on the request object to append into the log payload
    const { lookupRequestExtraProperties } = this.options;
    lookupRequestExtraProperties?.forEach((extraPropertyName) => {
      requestLogPayload[extraPropertyName] = req[extraPropertyName];
    });

    // Do not log excluded routes
    const { excludedRoutes } = this.options;
    if (excludedRoutes.includes(requestLogPayload.http.path)) {
      return next.handle();
    }

    // Saves timestamp before executing handler
    const startTimestamp = Date.now();

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
              startTimestamp: startTimestamp,
              executionTime: Date.now() - startTimestamp,
            },
          };

          Logger.log(httpLogPayload);
        },
        error: (error: IResolvedLogInterceptorError) => {
          const responseLogPayload: IHttpResponseLogPayload = {
            statusCode: error?.status || 500,
            result: error?.response || error?.stack || error.toString(),
          };

          const httpLogPayload: IHttpLogPayload = {
            request: requestLogPayload,
            response: responseLogPayload,
            details: {
              startTimestamp: startTimestamp,
              executionTime: Date.now() - startTimestamp,
              errorStack: error?.stack,
            },
          };

          Logger.error(httpLogPayload);
        },
      }),
    );
  }
}
