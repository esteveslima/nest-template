// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { AuthUnauthorizedException } from 'src/application/exceptions/services/auth/auth-unauthorized.exception';
import { ITokenGateway } from 'src/application/interfaces/ports/token/token-gateway.interface';
import { IAuthRestService } from 'src/application/interfaces/services/auth/auth-rest/auth-rest.interface';
import {
  IAuthRestServiceAuthLoginParams,
  IAuthRestServiceAuthLoginResult,
} from 'src/application/interfaces/services/auth/auth-rest/methods/auth-login.interface';
import { AuthTokenPayload } from 'src/application/interfaces/types/auth/auth-token-payload.interface';
import { UserInternalService } from '../user/user-internal.service';

@Injectable()
export class AuthRestService implements IAuthRestService {
  // Get services and repositories from DI
  constructor(
    private tokenGateway: ITokenGateway<AuthTokenPayload>,
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async authLogin(
    params: IAuthRestServiceAuthLoginParams,
  ): Promise<IAuthRestServiceAuthLoginResult> {
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

    return { token };
  }
}
