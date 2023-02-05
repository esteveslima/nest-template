// Composite decorator, to apply auth guard and set allowed roles

import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { AuthTokenPayload } from 'src/application/interfaces/types/auth/auth-token-payload.interface';
import { graphqlAuthFieldMiddleware } from '../../../enhancers/middlewares/graphql-auth-field.middleware';
import { GraphqlAllowFieldRoles } from './graphql-allow-field-roles.decorator';

export function GraphqlAuthField(...roles: AuthTokenPayload['role'][]) {
  return applyDecorators(
    GraphqlAllowFieldRoles(...roles), // Decorator ot mark allowed roles for graphql model field
    Field({
      middleware: [graphqlAuthFieldMiddleware], // Apply the auth field middleware
      nullable: true, // "Private" fields must be nullable to allow not returning data on unauthorized access(errors are returned in separate objects)
    }),
  );
}
