// Responsible for containing business logic

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInternalService } from '../../../user/services/domain/user-internal.service';
import { AuthTokenService } from '../utils/auth-token.service';

import { LoginAuthResDTO } from '../../dtos/rest/res/login-auth-res.dto';
import { IJwtTokenPayload } from '../../interfaces/payloads/jwt-payload.interface';
import { LoginAuthReqDTO } from '../../dtos/rest/req/login-auth-req.dto';

@Injectable()
export class AuthRestService {
  // Get services and repositories from DI
  constructor(
    private authTokenService: AuthTokenService,
    private userInternalService: UserInternalService,
  ) {}

  // Define methods containing business logic

  async loginAuth(
    loginAuthCredentials: LoginAuthReqDTO,
  ): Promise<LoginAuthResDTO> {
    const { password, username } = loginAuthCredentials;

    const isAuthenticated = await this.userInternalService.verifyUserPassword(
      username,
      password,
    );

    if (!isAuthenticated) throw new UnauthorizedException();

    const user = await this.userInternalService.searchUserEntity({ username });

    const payload: IJwtTokenPayload = {
      id: user.id,
      email: user.email,
      name: user.username,
      role: user.role,
    };
    const token = await this.authTokenService.generateToken(payload);

    return { token };
  }
}
