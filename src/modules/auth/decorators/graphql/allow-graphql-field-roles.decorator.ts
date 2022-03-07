// Decorator to mark the allowed roles for the graphql field

import { Extensions } from '@nestjs/graphql';
import { roleType } from 'src/modules/auth/interfaces/user/user.interface';

export const AllowGraphqlFieldRoles = (...roles: roleType[]) =>
  Extensions({ roles });
