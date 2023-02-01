// Interceptor to only get user info if present as auth token, for usage on queries with models with mixed permissions on fields that cannot use an entire guard that would've block the entire query
// If this interceptor fails to set the user, it implies that only "public" fields can be selected, therefore auth field middleware will block any attempts to query the "private" fields

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenService } from 'src/modules/apps/auth/adapters/gateways/clients/token.service';
import { AuthTokenPayload } from 'src/modules/apps/auth/domain/auth-token-payload';
import { IRequestResolvedAuth } from '../utils/resolved-request.interface';

@Injectable()
export class GraphqlAuthDataInterceptor implements NestInterceptor {
  constructor(
    @Inject(TokenService)
    private tokenService: TokenService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Runs BEFORE the route handler

    const contextType = context.getType() as string;
    if (contextType !== 'graphql') return undefined; // abort for non-graphql contexts

    // Get request
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: IRequestResolvedAuth }>();

    const authData = await this.getJwtAuthData(req);
    req.authData = authData; // may not be able to set data for some contexts, such as for log interceptor on graphql requests

    return next.handle();
  }

  private async getJwtAuthData(req: Request): Promise<AuthTokenPayload> {
    if (!req.headers.authorization) return undefined;
    const [, jwtToken] = req.headers.authorization.split(' ');
    if (!jwtToken) return undefined;

    try {
      const payload = await this.tokenService.decodeToken(jwtToken);
      return payload as AuthTokenPayload;
    } catch (err) {
      return undefined;
    }
  }
}