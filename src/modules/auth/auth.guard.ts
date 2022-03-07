// Guard that can be used to apply the created authentication

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { IResolvedRequest } from 'src/common/interceptors/interfaces/resolved-request.interface';
import { AuthTokenService } from './auth-token.service';

import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';
import { IAuthUser, roleType } from './interfaces/user/user.interface';

// Extend the guard configured with and provided by passport
@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AuthTokenService)
    private authTokenService: AuthTokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = this.getReq(context); // get request context(with possible modified values)

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

    const isAuthorized = this.authorizeUser(user, roles);

    return isAuthorized; // False results in ForbiddenException
  }

  //TODO: create separated files for graphql context? For now, it's just replicating code
  private getReq(context: ExecutionContext): IResolvedRequest {
    const contextType = context.getType() as string;
    switch (contextType) {
      case 'http': {
        const req = context.switchToHttp().getRequest<IResolvedRequest>();
        return req;
      }
      case 'graphql': {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext<{ req: IResolvedRequest }>();
        return req;
      }
      default: {
        throw new InternalServerErrorException('Invalid log request context');
      }
    }
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
      const payload = await this.authTokenService.verifyToken(jwtToken);
      return payload as IJwtPayload;
    } catch (err) {
      throw new UnauthorizedException(
        'Token de autenticacao invalido',
        `${err}`,
      );
    }
  }

  private authorizeUser(user: IAuthUser, roles: roleType[]): boolean {
    if (!roles) return true; // Authorize if it doesnt require any role
    return roles.includes(user.role);
  }
}
