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

interface IErrorResponseBody {
  statusCode: number;
  message: (string | object)[];
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception; // Rethrow exceptions for non-http adapters, this catch-all filter doesn't work well for other adapters
    }

    const e = exception;

    const responseBody = this.buildErrorResponseBody(e);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  private buildErrorResponseBody(exception: unknown): IErrorResponseBody {
    let e = exception;

    // Handle only the first of an aggregate error
    if (e instanceof AggregateError) {
      const firstException = e.errors[0];
      e = firstException;
    }

    const errorResponseBody: IErrorResponseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: [InternalServerErrorException.name],
      error: InternalServerErrorException.name,
    };

    if (e instanceof HttpException) {
      errorResponseBody.statusCode = e.getStatus();
      errorResponseBody.message = [(e.getResponse() as any)?.['message']].flat(
        1,
      ) ?? [e.getResponse()];
      errorResponseBody.error = e.name;
    }

    return errorResponseBody;
  }
}
