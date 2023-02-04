// Map of all known errors, increment as necessary

enum TokenExceptionsEnum {
  TokenExpired,
  TokenMalformed,
  TokenPayloadInvalid,
}

export const AdapterExceptions = {
  ...TokenExceptionsEnum,
} as const;

export type AdapterExceptions = typeof AdapterExceptions;
