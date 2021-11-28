// Responsible for containing business logic

import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  IParamsServiceLoginAuth,
  IResultServiceLoginAuth,
} from './interfaces/login-auth.interface';

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

    if (!isAuthenticated) throw new HttpException('Unhauthorized', 401);

    const token = this.jwtService.sign({ username });

    return { token };
  }
}
