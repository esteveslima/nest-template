// Responsible for containing business logic

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginAuthReqDTO } from './dto/req/login-auth-req.dto';
import { LoginAuthResDTO } from './dto/res/login-auth-res.dto';
import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  // Get services and repositories from DI
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Define methods containing business logic

  async loginAuth(
    loginAuthCredentials: LoginAuthReqDTO,
  ): Promise<LoginAuthResDTO> {
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
