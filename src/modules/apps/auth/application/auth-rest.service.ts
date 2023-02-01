// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { TokenService } from '../adapters/gateways/clients/token.service';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { AuthTokenPayload } from '../domain/auth-token-payload';
import { UserInternalService } from '../../user/application/user-internal.service';
import {
  ILoginAuthRestParams,
  ILoginAuthRestResult,
} from './types/auth-rest-service/login.interface';

@Injectable()
export class AuthRestService {
  // Get services and repositories from DI
  constructor(
    private tokenService: TokenService, // Typing as the implementation class directly to make use of nest auto DI, but the recommended is to have an interface in the application layer
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async login(params: ILoginAuthRestParams): Promise<ILoginAuthRestResult> {
    const { password, username } = params;

    const isAuthenticated = await this.userInternalService.verifyUserPassword(
      username,
      password,
    );

    if (!isAuthenticated) throw new CustomException('AuthUnhauthorized');

    const user = await this.userInternalService.searchUser({ username });

    const payload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
      name: user.username,
      role: user.role,
    };
    const token = await this.tokenService.generateToken(payload);

    return { token };
  }
}
