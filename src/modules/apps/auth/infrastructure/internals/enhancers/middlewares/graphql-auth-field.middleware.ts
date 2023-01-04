// Auth for single fields, like on methods
// Requires the user info already present at request object(done by the custom GraphqlUserInfoInterceptor)

import {
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { IResolvedRequest } from 'src/common/types/resolved-request.interface';
import { AuthTokenPayload } from 'src/modules/apps/auth/domain/auth-token-payload';

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
    const errorMessage = `Not authenticated to access the field "${fieldName}"`;
    Logger.error(errorMessage);
    return new UnauthorizedException(errorMessage);
  }

  const rolesMetadataKey = 'roles';
  const roles = extensions[rolesMetadataKey] as AuthTokenPayload['role'][];

  const isAuthorized = authorizeUser(user, roles);
  if (!isAuthorized) {
    // If user doesn't have permissions, return error for user
    const errorMessage = `Not authorized to access the field "${fieldName}"`;
    Logger.error(errorMessage);
    return new ForbiddenException(errorMessage);
  }

  const fieldResolvedValue = await next();
  return fieldResolvedValue;
};

const authorizeUser = (
  user: AuthTokenPayload,
  roles: AuthTokenPayload['role'][],
): boolean => {
  if (!roles) return true; // Authorize if it doesnt require any role
  return roles.includes(user.role);
};
