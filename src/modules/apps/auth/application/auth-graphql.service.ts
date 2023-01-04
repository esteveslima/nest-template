// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { UserInternalService } from '../../user/application/user-internal.service';
import { TokenService } from '../adapters/gateways/clients/token.service';
import { AuthTokenPayload } from '../domain/auth-token-payload';
import {
  ILoginAuthGraphqlParams,
  ILoginAuthGraphqlResult,
} from './types/auth-graphql-service/login.interface';

@Injectable()
export class AuthGraphqlService {
  // Get services and repositories from DI
  constructor(
    private tokenService: TokenService, // Typing as the implementation class directly to make use of nest auto DI, but the recommended is to have an interface in the application layer
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async login(
    params: ILoginAuthGraphqlParams,
  ): Promise<ILoginAuthGraphqlResult> {
    const { password, username } = params;

    const isAuthenticated = await this.userInternalService.verifyUserPassword(
      username,
      password,
    );

    if (!isAuthenticated) throw new CustomException('AuthUnhauthorized');

    const user = await this.userInternalService.searchUserEntity({ username });

    const payload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
      name: user.username,
      role: user.role,
    };
    const token = await this.tokenService.generateToken({
      tokenPayload: payload,
    });

    return token;
  }
}
