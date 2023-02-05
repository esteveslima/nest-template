// Decorator to mark the allowed roles for the method

import { SetMetadata } from '@nestjs/common';
import { AuthTokenPayload } from 'src/modules/apps/auth/application/interfaces/types/auth-token-payload.interface';

export const AllowRoles = (...roles: AuthTokenPayload['role'][]) =>
  SetMetadata('roles', roles);
