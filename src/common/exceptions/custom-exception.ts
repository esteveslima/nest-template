// Class created to be a wrapper for errors, as the errors related to the details/infrastructure(e.g.: framework/packages/libs/clients/etc..) should not leak into the domain
// This should be used to map every error/exception found in development that could be handled or mapped into a user reponse

// A better approach would be using a class per exception instead of error codes in enums, that way would be possible to each error have it's payload with it's interface for further usage...
// ... not implemented because couldn't find a way to map the thrown exception class into an error like the current implemented code, it would be possible only by using a series of if statements with instanceof tho...
// ... with this current approach, if it's needed to make usage of an error data it is advised to refactor the method to simply return resolved/error values than throwing data

// the generics ensure the exceptions are provided
export class CustomException<T = void, Exceptions extends T = T> extends Error {
  constructor(public type: keyof Exceptions, public cause?: unknown) {
    super();
    this.name = this.constructor.name;
    const stringifiedDetails = !!cause ? `(${JSON.stringify(cause)})` : '';
    this.message = `${String(type)} ${stringifiedDetails}`.trim();
  }
}
