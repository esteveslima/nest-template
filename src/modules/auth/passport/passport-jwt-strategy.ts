// Service containing authentication logic for jwt tokens, returning user for further usage

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { IJwtPayload } from '../interfaces/jwt/jwt-payload.interface';

// Extending passport strategy class, which already validates de JWT token, to insert new logic in validation method
@Injectable()
export class PassportJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload) {
    const { id } = payload;

    const user = await this.userService.getUserById(id);

    return user; // Falsy returns results in UnauthorizedException
  }
}
