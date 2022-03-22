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
import { AuthTokenService } from '../../../services/adapters/clients/auth-token.service';
import {
  IJwtTokenPayload,
  roleType,
} from '../../../interfaces/payloads/jwt-payload.interface';
import { IAuthUserInfo } from '../../../interfaces/payloads/auth-user-info.interface';
import { getRequestObject } from 'src/common/internals/enhancers/utils/get-request-object';

// Extend the guard configured with and provided by passport
@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AuthTokenService)
    private authTokenService: AuthTokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = getRequestObject(context); // get request context(with possible modified values)

    // Authentication
    const authPayload = await this.authenticateRequest(req);
    const user: IAuthUserInfo = { ...authPayload };
    req.user = user; // Insert user to request object, allowing to recover it on controllers

    // Authorization
    const rolesMetadataKey = 'roles';
    const roles = this.reflector.get<roleType[]>(
      rolesMetadataKey,
      context.getHandler(),
    ); // get the allowed roles(configured with decorator)
    const isAuthorized = this.authorizeUser(user, roles);
    return isAuthorized; // False results in ForbiddenException
  }

  private async authenticateRequest(
    req: Request, //
  ): Promise<IJwtTokenPayload | never> {
    // Must throw UnauthorizedException on error

    if (!req.headers.authorization) {
      throw new UnauthorizedException('auth header not found');
    }
    const [, jwtToken] = req.headers.authorization.split(' '); // "Bearer <token>"
    if (!jwtToken) {
      throw new UnauthorizedException('auth header token not found');
    }

    try {
      const payload = await this.authTokenService.decodeToken(jwtToken);
      return payload as IJwtTokenPayload;
    } catch (e) {
      throw new UnauthorizedException(`${e}`); // TODO: ideally, this shouldn't provide details for more security
    }
  }

  private authorizeUser(user: IAuthUserInfo, roles: roleType[]): boolean {
    if (!roles) return true; // Authorize if it doesnt require any role
    return roles.includes(user.role);
  }
}
