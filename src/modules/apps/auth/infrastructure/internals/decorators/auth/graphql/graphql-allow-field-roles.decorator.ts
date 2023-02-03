// Decorator to mark the allowed roles for the graphql field

import { Extensions } from '@nestjs/graphql';
import { AuthTokenPayload } from 'src/modules/apps/auth/application/interfaces/types/auth-token-payload.interface';

export const GraphqlAllowFieldRoles = (...roles: AuthTokenPayload['role'][]) =>
  Extensions({ roles });
