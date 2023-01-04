// Decorator to mark the allowed roles for the method

import { SetMetadata } from '@nestjs/common';
import { AuthTokenPayload } from 'src/modules/apps/auth/domain/auth-token-payload';

export const AllowRoles = (...roles: AuthTokenPayload['role'][]) =>
  SetMetadata('roles', roles);
