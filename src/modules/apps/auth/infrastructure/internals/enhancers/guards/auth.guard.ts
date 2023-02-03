// Guard that can be used to apply the created authentication

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenJwtGateway } from 'src/modules/apps/auth/adapters/gateways/clients/token-jwt.gateway';
import { ITokenGateway } from 'src/modules/apps/auth/application/interfaces/ports/token/token-gateway.interface';
import { AuthTokenPayload } from 'src/modules/apps/auth/application/interfaces/types/auth-token-payload.interface';
import { getRequestObject } from 'src/modules/apps/auth/infrastructure/internals/enhancers/utils/get-request-object';

// Extend the guard configured with and provided by passport
@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(TokenJwtGateway)
    private tokenGateway: ITokenGateway<AuthTokenPayload>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = getRequestObject(context); // get request context(with possible modified values)

    // Authentication
    const authPayload = await this.authenticateRequest(req);
    const authData: AuthTokenPayload = { ...authPayload };
    req.authData = authData; // Insert user to request object, allowing to recover it in the future

    // Authorization
    const rolesMetadataKey = 'roles';
    const allowedRoles = this.reflector.get<AuthTokenPayload['role'][]>(
      rolesMetadataKey,
      context.getHandler(),
    ); // get the allowed roles(configured with decorator)
    const isAuthorized = this.checkUserAuthorization(authData, allowedRoles);
    return isAuthorized; // False results in ForbiddenException
  }

  private async authenticateRequest(
    req: Request,
  ): Promise<AuthTokenPayload | never> {
    // Must throw UnauthorizedException on error

    if (!req.headers.authorization) {
      throw new UnauthorizedException('Auth header not found');
    }
    const [, jwtToken] = req.headers.authorization.split(' '); // "Bearer <token>"
    if (!jwtToken) {
      throw new UnauthorizedException('Auth header token not found');
    }

    try {
      const tokenPayload = await this.tokenGateway.decodeToken({
        token: jwtToken,
      });
      return tokenPayload;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Auth token invalid');
    }
  }

  private checkUserAuthorization(
    user: AuthTokenPayload,
    allowedRoles: AuthTokenPayload['role'][],
  ): boolean {
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  }
}
