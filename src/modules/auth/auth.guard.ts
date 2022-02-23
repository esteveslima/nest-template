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

import { AuthService } from './auth.service';
import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';
import { IAuthUser, roleType } from './interfaces/user/user.interface';

// Extend the guard configured with and provided by passport
@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AuthService) private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest(); // get request context(with possible modified values)

    // Authentication

    const authPayload = await this.authenticateRequest(req);

    const user: IAuthUser = { ...authPayload };
    req.user = user; // Insert user to request object, allowing to recover it on controllers

    // Authorization

    const rolesMetadataKey = 'roles';
    const roles = this.reflector.get<roleType[]>(
      rolesMetadataKey,
      context.getHandler(),
    ); // get the allowed roles(configured with decorator)

    if (!roles) return true; // Authorize if it doesnt require any role

    const isAuthorized = this.authorizeUser(user, roles);

    return isAuthorized; // False results in ForbiddenException
  }

  private async authenticateRequest(
    req: Request,
  ): Promise<IJwtPayload | never> {
    // Must throw UnauthorizedException on error

    if (!req.headers.authorization)
      throw new UnauthorizedException('Token de autenticacao nao encontrado');
    const [, jwtToken] = req.headers.authorization.split(' ');
    if (!jwtToken)
      throw new UnauthorizedException('Token de autenticacao nao encontrado');

    try {
      const payload = await this.authService.verifyToken(jwtToken);
      return payload as IJwtPayload;
    } catch (err) {
      throw new UnauthorizedException(
        'Token de autenticacao invalido',
        `${err}`,
      );
    }
  }

  private authorizeUser(user: IAuthUser, roles: roleType[]): boolean {
    return roles.includes(user.role);
  }
}
