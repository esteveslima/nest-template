// Class created to be a contain errors data

interface IMapExceptionsParams<Exceptions, MappedError> {
  exception: unknown;
  defaultError: MappedError;
  errorMap: Partial<
    Record<
      keyof Exceptions,
      <MappedException extends Exception>(
        mappedException: MappedException,
      ) => MappedError
    >
  >;
}

export class Exception<Payload = any> extends Error {
  constructor(
    public cause?: any, // for debug details
    public payload?: Payload, // for passing up data
  ) {
    super();
    const stringifiedCause = !!cause ? `(${JSON.stringify(cause)})` : '';
    this.message = `${stringifiedCause}`.trim();
    this.name = this.constructor.name;
  }

  // Helper to map exceptions into another error
  public static mapExceptions<
    Exceptions extends object,
    MappedError extends Error,
  >(
    params: IMapExceptionsParams<Exceptions, MappedError>,
  ): MappedError | unknown {
    const { defaultError, exception, errorMap } = params;
    let e = exception;

    if (e instanceof AggregateError) {
      const firstException = e.errors[0];
      e = firstException;
    }

    if (e instanceof Exception) {
      let mappedException = defaultError;

      const exceptionTypeName = e.name as keyof Exceptions;
      const exceptionToErrorMapFactory = errorMap[exceptionTypeName];
      const hasDefinedFactory = !!exceptionToErrorMapFactory;
      if (hasDefinedFactory) {
        mappedException = exceptionToErrorMapFactory(e);
      }

      mappedException.stack = e.stack;
      return mappedException;
    }

    return e;
  }
}
