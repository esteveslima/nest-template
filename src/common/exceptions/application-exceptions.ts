// Map of all known errors, increment as necessary

enum InternalExceptionsEnum {
  AuthUserEntityNotFound,
}

enum AuthExceptionsEnum {
  AuthUnhauthorized,
}

enum UserExceptionsEnum {
  UserAlreadyExists,
  UserNotFound,
  UserUpdateFail,
  UserSearchInvalidFilters,
}

enum MediaExceptionsEnum {
  MediaAlreadyExists,
  MediaNotFound,
}

export const ApplicationExceptions = {
  ...InternalExceptionsEnum,
  ...AuthExceptionsEnum,
  ...UserExceptionsEnum,
  ...MediaExceptionsEnum,
} as const;

export type ApplicationExceptions = typeof ApplicationExceptions;
