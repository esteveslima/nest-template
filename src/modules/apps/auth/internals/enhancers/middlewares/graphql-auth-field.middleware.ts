// Auth for single fields, like on methods
// Requires the user info already present at request object(done by the custom GraphqlUserInfoInterceptor)

import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { IResolvedRequest } from 'src/common/interfaces/internals/enhancers/interceptors/resolved-request.interface';
import { roleType } from '../../../interfaces/payloads/jwt-payload.interface';
import { IAuthUserInfo } from '../../../interfaces/payloads/auth-user-info.interface';

export const graphqlAuthFieldMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { fieldName } = ctx.info;
  const { extensions } = ctx.info.parentType.getFields()[fieldName];
  const { req } = ctx.context as { req: IncomingMessage & IResolvedRequest };
  const { user } = req;

  const isAuthenticated = !!req.user; // Should be set by the custom jwt graphql user info interceptor
  if (!isAuthenticated) {
    // If user couldn't be verified, return error for user
    return new UnauthorizedException(
      `Not authenticated to access the field "${fieldName}"`,
    );
  }

  const rolesMetadataKey = 'roles';
  const roles = extensions[rolesMetadataKey] as roleType[];

  const isAuthorized = authorizeUser(user, roles);
  if (!isAuthorized) {
    // If user doesn't have permissions, return error for user
    return new ForbiddenException(
      `Not authorized to access the field "${fieldName}"`,
    );
  }

  const fieldResolvedValue = await next();
  return fieldResolvedValue;
};

const authorizeUser = (user: IAuthUserInfo, roles: roleType[]): boolean => {
  if (!roles) return true; // Authorize if it doesnt require any role
  return roles.includes(user.role);
};
