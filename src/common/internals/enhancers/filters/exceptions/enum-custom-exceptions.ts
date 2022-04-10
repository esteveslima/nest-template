// Map of all known errors, increment as necessary

enum enumInternalCustomExceptions {
  AuthUserEntityNotFound,
}

enum enumAuthCustomExceptions {
  AuthTokenExpired,
  AuthTokenMalformed,
  AuthTokenPayloadInvalid,
  AuthUnhauthorized,
}

enum enumUserCustomExceptions {
  UserAlreadyExists,
  UserNotFound,
  UserUpdateFail,
  UserSearchInvalidFilters,
}

enum enumMediaCustomExceptions {
  MediaAlreadyExists,
  MediaNotFound,
}

export const enumCustomExceptions = {
  ...enumInternalCustomExceptions,
  ...enumAuthCustomExceptions,
  ...enumUserCustomExceptions,
  ...enumMediaCustomExceptions,
} as const;
