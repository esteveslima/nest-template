// Decorator to mark the allowed roles for the graphql field

import { Extensions } from '@nestjs/graphql';
import { roleType } from '../../interfaces/payloads/jwt-payload.interface';

export const GraphqlAllowFieldRoles = (...roles: roleType[]) =>
  Extensions({ roles });
