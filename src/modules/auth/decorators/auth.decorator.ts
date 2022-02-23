// Composite decorator, to apply auth guard and set allowed roles

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuardJwt } from '../auth.guard';
import { AllowRoles, roleType } from './allow-roles.decorator';

export function Auth(...roles: roleType[]) {
  return applyDecorators(
    AllowRoles(...roles), // Decorator ot mark allowed roles for route
    UseGuards(AuthGuardJwt), // Guards with to protect routes from unhauthorized access
  );
}
