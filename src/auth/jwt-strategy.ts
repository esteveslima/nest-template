// Service containing logic for validating jwt tokens
// Also returning user data after authenticating

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { IJwtPayload } from './interfaces/jwt/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;

    const user = await this.userService.searchUser({ username }); // return user from service, which may remove some properties(switch to repository if necessary)

    return user;
  }
}
