import { TokenExpiredException } from 'src/application/exceptions/ports/token/token-expired.exception';
import { TokenMalformedException } from 'src/application/exceptions/ports/token/token-malformed.exception';
import { TokenPayloadInvalidException } from 'src/application/exceptions/ports/token/token-payload-invalid.exception';
import { AuthUnauthorizedException } from 'src/application/exceptions/services/auth/auth-unauthorized.exception';
import { UserSearchInvalidFiltersException } from 'src/application/exceptions/services/user/user-search-invalid-filters.exception';
import { MediaNotFoundException } from 'src/domain/exceptions/media/media-not-found.exception';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user/user-already-exists.exception';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { UserUpdateFailException } from 'src/domain/exceptions/user/user-update-fail.exception';

export const exceptionsIndex = {
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

export type ExceptionsIndex = typeof exceptionsIndex;
