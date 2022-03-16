// Composite decorator, to apply auth guard and set allowed roles

import { applyDecorators, UseGuards } from '@nestjs/common';
import { roleType } from '../../interfaces/payloads/jwt-payload.interface';
import { AuthGuardJwt } from '../enhancers/guards/auth.guard';
import { AllowRoles } from './allow-roles.decorator';

export function Auth(...roles: roleType[]) {
  return applyDecorators(
    AllowRoles(...roles), // Decorator ot mark allowed roles for route
    UseGuards(AuthGuardJwt), // Guards with to protect routes from unhauthorized access
  );
}
