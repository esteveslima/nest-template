// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { AuthTokenPayload } from '../../interfaces/types/auth/auth-token-payload.interface';
import { IAuthGraphqlService } from '../../interfaces/services/auth/auth-graphql/auth-graphql.interface';
import {
  IAuthGraphqlServiceAuthLoginParams,
  IAuthGraphqlServiceAuthLoginResult,
} from '../../interfaces/services/auth/auth-graphql/methods/auth-login.interface';
import { ITokenGateway } from '../../interfaces/ports/token/token-gateway.interface';
import { UserInternalService } from '../user/user-internal.service';
import { AuthUnauthorizedException } from 'src/application/exceptions/services/auth/auth-unauthorized.exception';

@Injectable()
export class AuthGraphqlService implements IAuthGraphqlService {
  // Get services and repositories from DI
  constructor(
    private tokenGateway: ITokenGateway<AuthTokenPayload>,
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async authLogin(
    params: IAuthGraphqlServiceAuthLoginParams,
  ): Promise<IAuthGraphqlServiceAuthLoginResult> {
    const { password, username } = params;

    const isAuthenticated = await this.userInternalService.verifyUserPassword({
      username,
      password,
    });

    if (!isAuthenticated) {
      throw new AuthUnauthorizedException(params);
    }

    const user = await this.userInternalService.searchUser({ username });

    const tokenPayload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const { token } = await this.tokenGateway.generateToken({ tokenPayload });

    return token;
  }
}
