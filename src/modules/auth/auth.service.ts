// Responsible for containing business logic

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; //TODO: create interfaces for these classes to avoid importing code just to have the definition
import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';
import {
  IParamsServiceLoginAuth,
  IResultServiceLoginAuth,
} from './interfaces/service/auth/login-auth.interface';

@Injectable()
export class AuthService {
  // Get services and repositories from DI
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Define methods containing business logic

  async loginAuth(
    loginAuthCredentials: IParamsServiceLoginAuth,
  ): Promise<IResultServiceLoginAuth> {
    const { password, username } = loginAuthCredentials;

    const isAuthenticated = await this.userService.verifyUserPassword(
      username,
      password,
    );

    if (!isAuthenticated) throw new UnauthorizedException();

    const payload: IJwtPayload = { username };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
