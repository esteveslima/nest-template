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
    e: unknown,
    exceptionMap: Partial<
      Record<keyof typeof CustomException.customExceptions, HttpException>
    >,
  ): HttpException {
    if (e instanceof CustomException) {
      const mappedException =
        exceptionMap[e.type] ?? new InternalServerErrorException();
      mappedException.stack = e.stack;
      return mappedException;
    }

    const defaultException = new InternalServerErrorException();
    defaultException.stack = (e as Error)?.stack;
    return defaultException;
  }
}

// // (not being used anymore, leaving for future reference)
// // Workaround for typing static objects without losing the autocomplete
// function asSomeType<T extends ISomeType>(arg: T): T {
//   return arg;
// }
