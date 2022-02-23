import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IRequestLogPayload } from 'src/common/interceptors/interfaces/log/request-log-payload.interface';
import { IResponseLogPayload } from 'src/common/interceptors/interfaces/log/response-log-payload.interface';
import { IAuthUser } from 'src/modules/auth/interfaces/user/user.interface';

@Catch(HttpException)
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (!req['alreadyLogged']) {
      this.logRequest(req, exception);
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object') {
      res.status(status).json(exceptionResponse);
    } else {
      res.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }
  }

  private logRequest(req: Request, exception: HttpException) {
    const requestLogPayload: IRequestLogPayload = {
      method: Object.keys(req.route?.methods || {})[0]?.toUpperCase(),
      path: req.route?.path,
      payload: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      },
      auth: {
        user: req['user'] as IAuthUser,
      },
    };

    const responseLogErrorPayload: IResponseLogPayload = {
      statusCode: exception.getStatus(),
      result: exception.message,
    };

    Logger.error(
      JSON.stringify({
        request: requestLogPayload,
        response: responseLogErrorPayload,
        error: exception.stack,
        startTime: undefined,
        executionTime: undefined,
      }),
    );
  }
}
