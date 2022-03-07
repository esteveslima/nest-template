// Interceptor to log incoming requests and outgoing responses

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IGraphQLInfo } from './interfaces/log/graphql-info.interface';
import { ILogPayload } from './interfaces/log/log-payload.interface';
import { IRequestLogPayload } from './interfaces/log/request-log-payload.interface';
import { IResponseLogPayload } from './interfaces/log/response-log-payload.interface';
import { IResolvedError } from './interfaces/resolved-error.interface';
import { IResolvedRequest } from './interfaces/resolved-request.interface';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler

    // Get request data
    const req = this.getReq(context);
    const graphqlInfo = this.getGraphqlInfo(context);

    // Build request log object
    const requestLogPayload: IRequestLogPayload = {
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
          typename: graphqlInfo?.path?.typename.toUpperCase(),
          key: graphqlInfo?.path?.key,
        },
        fieldNodes: graphqlInfo?.fieldNodes?.map((fieldNode) => ({
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

    // Store timestamp before executing handler
    req.startTimestamp = Date.now();

    return next.handle().pipe(
      // Runs AFTER the route handler
      tap({
        next: (result: any) => {
          const responseLogPayload: IResponseLogPayload = {
            statusCode: req.res.statusCode,
            result,
          };

          const logPayload: ILogPayload = {
            request: requestLogPayload,
            response: responseLogPayload,
            startTimestamp: req.startTimestamp,
            executionTime: Date.now() - req.startTimestamp,
          };

          Logger.log(JSON.stringify(logPayload)); // Stringify logs for better visualization on cloud tools like aws cloudwatch
          req.isRequestLogged = true; // avoid repeating logs
        },
        error: (error: IResolvedError) => {
          const responseLogPayload: IResponseLogPayload = {
            statusCode: error?.status || 500,
            result: error?.response || error?.stack || error.toString(),
          };

          const logPayload: ILogPayload = {
            request: requestLogPayload,
            response: responseLogPayload,
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

  private getReq(context: ExecutionContext): IResolvedRequest {
    const contextType = context.getType() as string;
    switch (contextType) {
      case 'http': {
        const req = context.switchToHttp().getRequest<IResolvedRequest>();
        return req;
      }
      case 'graphql': {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext<{ req: IResolvedRequest }>();
        return req;
      }
      default: {
        throw new InternalServerErrorException('Invalid log request context');
      }
    }
  }

  private getGraphqlInfo(context: ExecutionContext): IGraphQLInfo {
    const contextType = context.getType() as string;
    if (contextType !== 'graphql') return undefined;

    const gqlContext = GqlExecutionContext.create(context);
    const gqlInfo = gqlContext.getInfo() as IGraphQLInfo;

    return gqlInfo;
  }
}

// TODO: check if request/response data shouldn't be logged
// TODO: check if should log all external http requests(with Axios interceptor)
//     - check if should track request id across logs(AsyncLocalStorage)
