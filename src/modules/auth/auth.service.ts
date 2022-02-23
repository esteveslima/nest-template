// Responsible for containing business logic

import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

    const user = await this.userService.searchUser({ username });

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      name: user.username,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async verifyToken(token: string): Promise<Record<string, any>> {
    const result: Record<string, any> = this.jwtService.verify(token);
    const tokenPayload = result;

    if (typeof tokenPayload !== 'object')
      throw new UnprocessableEntityException('Token invalido');

    return tokenPayload;
  }

  async generateToken(tokenPayload: Record<string, any>): Promise<string> {
    const token = this.jwtService.sign(tokenPayload);

    return token;
  }
}
