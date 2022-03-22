// Disabled, left for future reference

// // Maps typeorm exceptions into proper exceptions to isolate the application layers preventing ORM details to propagate
// //TODO: wrap all repository methods with custom typescript decorator that applies this mapper?

// import { ConflictException, Logger } from '@nestjs/common';

// interface ITypeormException extends Error {
//   driverError: {
//     code: string;
//     detail: string;
//   };
// }

// interface ITypeormExceptionsCodeMap {
//   [code: string]: (e: ITypeormException) => unknown;
// }

// // Not creating this in a separated exception filter to avoid propagating typeorm exceptions to implementations that may catch these exceptions
// // Ideally this layer should have it's own exceptions and be mapped to http related exceptions on a different layer, this was made directly due convenience for this prototype project
// export class TypeORMExceptionsMapper {
//   private static readonly typeormExceptionsCodeMap: ITypeormExceptionsCodeMap =
//     {
//       23505: (e) => new ConflictException(e.driverError.detail),
//     };

//   static mapException(e: any): unknown {
//     Logger.error(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)

//     const exception = e as ITypeormException;
//     const typeormErrorCode = exception?.driverError?.code;
//     const baseException = this.typeormExceptionsCodeMap[typeormErrorCode];

//     if (!baseException) {
//       // Return original exception and provide no information for non-mapped errors to avoid exposing potential implementation details
//       return e;
//     }

//     const mappedException = baseException(exception);
//     return mappedException;
//   }
// }
