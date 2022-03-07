// Responsible for containing business logic

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInternalService } from '../user/user-internal.service';
import { AuthTokenService } from './auth-token.service';
import { LoginAuthReqDTO } from './dto/req/login-auth-req.dto';
import { LoginAuthResDTO } from './dto/res/login-auth-res.dto';
import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
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

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      name: user.username,
      role: user.role,
    };
    const token = await this.authTokenService.generateToken(payload);

    return { token };
  }
}
