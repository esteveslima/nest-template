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

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor(
    private logContext: string, // context name to which the log is attatched to
    private verbose = process.env.NODE_ENV === 'prod', // defaults to log verboselly in production
  ) {
    this.logger = new Logger(logContext, { timestamp: true });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler
    const req = context.switchToHttp().getRequest();
    const {
      headers,
      params,
      query,
      body,
      route: { path, methods },
      user,
    } = req;

    const requestData = {
      path: `${Object.keys(methods)[0].toUpperCase()} ${path}`,
      payload: {
        headers,
        params,
        query,
        body,
      },
      auth: { user },
    };

    return next.handle().pipe(
      // Runs AFTER the route handler
      tap({
        next: (result) => {
          const { statusCode } = req.res;
          const responseData = {
            statusCode,
            result,
          };

          if (this.verbose) {
            this.logger.log({ requestData, responseData });
          } else {
            this.logger.log(`${responseData.statusCode} ${requestData.path}`);
          }
        },
        error: (error) => {
          const { status, message } = error;
          const responseErrorData = {
            statusCode: status,
            message,
          };

          if (this.verbose) {
            this.logger.error({ requestData, responseErrorData });
          } else {
            this.logger.error(
              `${responseErrorData.statusCode} ${requestData.path}`,
            );
          }
        },
      }),
    );
  }
}
