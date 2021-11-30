// Decorator to mark the allowed roles for the method

import { SetMetadata } from '@nestjs/common';
import { enumRole } from '../../user/user.entity';

export type roleType = enumRole | keyof typeof enumRole; // allow enum objects and enum keys

export const AllowRoles = (...roles: roleType[]) => SetMetadata('roles', roles);
