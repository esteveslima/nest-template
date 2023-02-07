// Guard that can be used to apply the created authentication

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { LogPinoClientGateway } from 'src/adapters/gateways/clients/log-pino-client.gateway';
import { TokenJwtClientGateway } from 'src/adapters/gateways/clients/token-jwt-client.gateway';
import { ILogGateway } from 'src/application/interfaces/ports/log/log-gateway.interface';
import { ITokenGateway } from 'src/application/interfaces/ports/token/token-gateway.interface';
import { AuthTokenPayload } from 'src/application/interfaces/types/auth/auth-token-payload.interface';
import { getRequestObject } from '../../utils/get-request-object';

@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(TokenJwtClientGateway)
    private tokenGateway: ITokenGateway<AuthTokenPayload>,
    @Inject(LogPinoClientGateway)
    private logGateway: ILogGateway,
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
      this.logGateway.error(e);
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
