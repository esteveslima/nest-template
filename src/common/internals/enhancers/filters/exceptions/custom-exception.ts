import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { enumCustomExceptions } from './enum-custom-exceptions';

// Class created to be a wrapper for errors, as the errors related to the details/infrastructure(e.g.: framework/packages/libs/clients/etc..) should not leak into the domain
// This should be used to map every error/exception found in development that could be handled or mapped into a user reponse
export class CustomException extends Error {
  public static readonly customExceptions: typeof enumCustomExceptions =
    enumCustomExceptions;

  constructor(
    public type: keyof typeof CustomException.customExceptions,
    public details?: unknown,
  ) {
    super();
    this.name = 'CustomException';
    const stringifiedDetails = !!details ? `(${JSON.stringify(details)})` : '';
    this.message = `${type} ${stringifiedDetails}`.trim();
  }

  // method to reduce boilerplate code when mapping internal exceptions into interface adapters(http) errors
  public static mapHttpException(
    exception: unknown,
    exceptionMap: Partial<
      Record<
        keyof typeof CustomException.customExceptions,
        (customException: CustomException) => HttpException
      >
    >,
  ): HttpException | unknown {
    let e = exception;

    if (e instanceof AggregateError) {
      const firstException = e.errors[0];
      e = firstException;
    }

    if (e instanceof CustomException) {
      const mappedExceptionFactory = exceptionMap[e.type];
      const mappedException = mappedExceptionFactory
        ? mappedExceptionFactory(e)
        : new InternalServerErrorException();
      mappedException.stack = e.stack;
      return mappedException;
    }

    return e;
  }
}

// // (below not being used anymore, leaving for future reference)
// // Workaround for typing static objects without losing the autocomplete
// function asSomeType<T extends ISomeType>(arg: T): T {
//   return arg;
// }
