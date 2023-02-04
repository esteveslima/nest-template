import { CustomException } from './custom-exception';

export class CustomExceptionMapper {
  // method to reduce boilerplate code when mapping internal exceptions into other errors
  public static mapError<
    Exceptions extends object,
    MappedError extends Error,
  >(params: {
    exception: unknown;
    defaultError: MappedError;
    errorMap: Partial<
      Record<
        keyof Exceptions,
        (customException: CustomException<Exceptions>) => MappedError
      >
    >;
  }): MappedError | unknown {
    const { defaultError, exception, errorMap } = params;
    let e = exception;

    if (e instanceof AggregateError) {
      const firstException = e.errors[0];
      e = firstException;
    }

    if (e instanceof CustomException) {
      const exceptionTypeName = e.type as keyof Exceptions;
      const exceptionToErrorFactory = errorMap[exceptionTypeName];

      const hasDefinedFactory = !!exceptionToErrorFactory;
      const mappedException = hasDefinedFactory
        ? exceptionToErrorFactory(e)
        : defaultError;

      mappedException.stack = e.stack;
      return mappedException;
    }

    return e;
  }
}
