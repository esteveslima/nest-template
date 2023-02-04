// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { AuthTokenPayload } from './interfaces/types/auth-token-payload.interface';
import { IAuthRestService } from './interfaces/services/auth-rest/auth-rest.interface';
import {
  IAuthRestServiceLoginParams,
  IAuthRestServiceLoginResult,
} from './interfaces/services/auth-rest/methods/login.interface';
import { ITokenGateway } from './interfaces/ports/token/token-gateway.interface';
import { UserInternalService } from '../../user/application/user-internal.service';
import { AuthUnauthorizedException } from 'src/common/exceptions/application/auth/auth-unauthorized.exception';

@Injectable()
export class AuthRestService implements IAuthRestService {
  // Get services and repositories from DI
  constructor(
    private tokenGateway: ITokenGateway<AuthTokenPayload>,
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async login(
    params: IAuthRestServiceLoginParams,
  ): Promise<IAuthRestServiceLoginResult> {
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
      name: user.username,
      role: user.role,
    };
    const { token } = await this.tokenGateway.generateToken({ tokenPayload });

    return { token };
  }
}
