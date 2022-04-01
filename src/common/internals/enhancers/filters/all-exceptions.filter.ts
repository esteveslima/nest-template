// Generic exception filter that converts exceptions to the main transporter adapter, which is http
// Not logging

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception; // Rethrow exceptions for non-http adapters, this catch-all filter doesn't work well for other adapters
    }

    // TODO: interceptor/filter to map local errors to http exceptions, so this point would have all exceptions mapped
    const responseBody = {
      error:
        exception instanceof HttpException
          ? exception.name
          : InternalServerErrorException.name,
      message:
        exception instanceof HttpException ? exception.message : undefined,
    };

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
