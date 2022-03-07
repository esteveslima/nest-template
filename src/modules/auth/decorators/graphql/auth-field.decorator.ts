// Composite decorator, to apply auth guard and set allowed roles

import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { authFieldMiddleware } from 'src/modules/auth/middlewares/graphql/auth-field.middleware';
import { roleType } from 'src/modules/auth/interfaces/user/user.interface';
import { AllowGraphqlFieldRoles } from './allow-graphql-field-roles.decorator';

export function AuthField(...roles: roleType[]) {
  return applyDecorators(
    AllowGraphqlFieldRoles(...roles), // Decorator ot mark allowed roles for graphql model field
    Field({
      middleware: [authFieldMiddleware], // Apply the auth field middleware
      nullable: true, // "Private" fields must be nullable to allow not returning data on unhauthorized access(errors are returned in separate objects)
    }),
  );
}
