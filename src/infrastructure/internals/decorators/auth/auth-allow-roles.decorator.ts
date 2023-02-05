// Decorator to mark the allowed roles for the method

import { SetMetadata } from '@nestjs/common';
import { AuthTokenPayload } from 'src/application/interfaces/types/auth/auth-token-payload.interface';

export const AuthAllowRoles = (...roles: AuthTokenPayload['role'][]) =>
  SetMetadata('roles', roles);
