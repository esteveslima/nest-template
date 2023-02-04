import { TokenExpiredException } from './ports/token/token-expired.exception';
import { TokenMalformedException } from './ports/token/token-malformed.exception';
import { TokenPayloadInvalidException } from './ports/token/token-payload-invalid.exception';
import { AuthUnauthorizedException } from './application/auth/auth-unauthorized.exception';
import { MediaNotFoundException } from './application/media/media-not-found.exception';
import { UserAlreadyExistsException } from './application/user/user-already-exists.exception';
import { UserNotFoundException } from './application/user/user-not-found.exception';
import { UserSearchInvalidFiltersException } from './application/user/user-search-invalid-filters.exception';
import { UserUpdateFailException } from './application/user/user-update-fail.exception';

export const exceptions = {
  TokenExpiredException,
  TokenMalformedException,
  TokenPayloadInvalidException,
  AuthUnauthorizedException,
  MediaNotFoundException,
  UserAlreadyExistsException,
  UserNotFoundException,
  UserSearchInvalidFiltersException,
  UserUpdateFailException,
};

export type Exceptions = typeof exceptions;
