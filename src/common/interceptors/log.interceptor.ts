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
import { IRequestLogPayload } from './interfaces/log/request-log-payload.interface';
import { IResponseLogPayload } from './interfaces/log/response-log-payload.interface';
import { IResolvedError } from './interfaces/resolved-error.interface';
import { IResolvedRequest } from './interfaces/resolved-request.interface';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler
    const req: IResolvedRequest = context.switchToHttp().getRequest();

    // filter out unwanted routes
    const excludedRoutes = ['/'];
    if (excludedRoutes.includes(req.route.path)) return undefined;

    const startTime = Date.now();
    const requestLogPayload: IRequestLogPayload = {
      method: Object.keys(req.route.methods)[0].toUpperCase(),
      path: req.route.path,
      payload: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      },
      auth: {
        user: req.user,
      },
    };

    // TODO: check if request/response data shouldn't be logged
    // TODO: check if should log all external http requests(with Axios interceptor)
    // TODO: check if should track request across logs(AsyncLocalStorage)

    return next.handle().pipe(
      // Runs AFTER the route handler
      tap({
        next: (result: any) => {
          const executionTime = Date.now() - startTime;
          const responseLogPayload: IResponseLogPayload = {
            statusCode: req.res.statusCode,
            result,
          };

          // Stringify logs for better visualization on cloud tools like aws cloudwatch
          Logger.log(
            JSON.stringify({
              request: requestLogPayload,
              response: responseLogPayload,
              startTime,
              executionTime,
            }),
          );
          req['alreadyLogged'] = true;
        },
        error: (error: IResolvedError) => {
          const executionTime = Date.now() - startTime;
          const responseLogPayload: IResponseLogPayload = {
            statusCode: error.status,
            result: error.response,
          };

          Logger.error(
            JSON.stringify({
              request: requestLogPayload,
              response: responseLogPayload,
              error: error.stack,
              startTime,
              executionTime,
            }),
          );
          req['alreadyLogged'] = true;
        },
      }),
    );
  }
}
