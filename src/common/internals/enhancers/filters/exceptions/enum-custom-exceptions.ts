// Map of all known errors, increment as necessary

enum enumInternalCustomExceptions {
  AuthUserEntityNotFound,
}

enum TokenCustomExceptions {
  TokenExpired,
  TokenMalformed,
  TokenPayloadInvalid,
}

enum enumAuthCustomExceptions {
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
  ...TokenCustomExceptions,
  ...enumAuthCustomExceptions,
  ...enumUserCustomExceptions,
  ...enumMediaCustomExceptions,
} as const;
