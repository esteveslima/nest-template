import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IResolvedInterceptorError } from './types/resolved-log-interceptor-error.interface';
import { ILogPayload } from '../../../types/log-payload.interface';
import { ILogInterceptorRequestObject } from './types/log-interceptor-request-object.interface';
import {
  ILogPayloadHttpParams,
  ILogPayloadHttpResult,
} from '../../../types/http/log-payload-http.interface';
import { IMinimalLogger } from '../../../types/minimal-logger.interface';
import * as _ from 'lodash';
import { getRequestObject } from '../../utils/get-request-object';
import { getGraphqlInfo } from '../../utils/get-graphql-info';

interface ILoggerInterceptorOptions {
  logger?: IMinimalLogger;
  excludedRoutes?: { method: string; path: string }[];
  lookupExtraProperties?: string[];
}

@Injectable()
export class LogHttpRequestInterceptor implements NestInterceptor {
  private loggerInterceptorOptions: ILoggerInterceptorOptions = {
    excludedRoutes: [],
    logger: Logger,
    lookupExtraProperties: [],
  };

  constructor(configOptions: ILoggerInterceptorOptions = {}) {
    this.loggerInterceptorOptions = _.merge(
      this.loggerInterceptorOptions,
      configOptions,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = getRequestObject<ILogInterceptorRequestObject>(context);
    const graphQLInfo = getGraphqlInfo(context);

    const method = req?.method?.toUpperCase();
    const path = `${req?.baseUrl}${req?.route?.path || ''}`;

    // Check if the route was excluded from logs
    const { excludedRoutes } = this.loggerInterceptorOptions;
    const isExcludedRoute = excludedRoutes.some(
      (excludedRoute) =>
        excludedRoute.method === method && excludedRoute.path === path,
    );
    if (isExcludedRoute) {
      return next.handle();
    }

    // Lookup for extra properties on the request object to append into the log payload
    const extraProperties: Record<string, unknown> = {};
    const { lookupExtraProperties } = this.loggerInterceptorOptions;
    lookupExtraProperties?.forEach((extraPropertyName) => {
      extraProperties[extraPropertyName] = req?.[extraPropertyName];
    });

    const graphqlDetails = graphQLInfo && {
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
    };

    const params: ILogPayloadHttpParams = {
      headers: req?.headers,
      pathParams: req?.params,
      queryParams: req?.query,
      body: req?.body,
    };

    const operation = `${method} ${path}`;

    const startTime = Date.now();

    //  //  //  //  //

    return next.handle().pipe(
      tap({
        next: (interceptedResult: any) => {
          const result: ILogPayloadHttpResult = {
            statusCode: req?.res.statusCode,
            result: interceptedResult,
          };

          const executionTime = Date.now() - startTime;
          const httpLogPayload: ILogPayload = {
            context: 'controller',
            operation,
            params,
            result,
            details: {
              startTime,
              executionTime,
              graphqlDetails,
              ...extraProperties,
            },
          };

          const { logger } = this.loggerInterceptorOptions;
          logger.log(httpLogPayload);
        },
        error: (interceptedError: IResolvedInterceptorError) => {
          const result: ILogPayloadHttpResult = {
            statusCode: interceptedError?.status || 500,
            result:
              interceptedError?.response ||
              interceptedError?.stack ||
              interceptedError.toString(),
          };

          const executionTime = Date.now() - startTime;
          const httpLogPayload: ILogPayload = {
            context: 'controller',
            operation,
            params,
            result,
            details: {
              startTime,
              executionTime,
              errorStack: interceptedError?.stack,
              graphqlDetails,
              ...extraProperties,
            },
          };

          const { logger } = this.loggerInterceptorOptions;
          logger.error(httpLogPayload);
        },
      }),
    );
  }
}
