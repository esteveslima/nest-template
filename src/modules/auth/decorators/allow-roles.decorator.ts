// Decorator to mark the allowed roles for the method

import { SetMetadata } from '@nestjs/common';
import { roleType } from '../interfaces/user/user.interface';

export const AllowRoles = (...roles: roleType[]) => SetMetadata('roles', roles);
