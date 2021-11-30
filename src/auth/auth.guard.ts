// Guard that can be used to apply the created authentication

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { UserEntity } from 'src/user/user.entity';

// Extend the guard configured with and provided by passport
@Injectable()
export class AuthGuardPassportJwt extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  //TODO: remove passport?(which has a lot of implementation on the backgound) and create own guard valdiation

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context); // super executes authentication configured with passport strategy

    const roles = this.reflector.get<string[]>('roles', context.getHandler()); // get the allowed roles(configured with decorator)
    if (!roles) return true;

    const req = context.switchToHttp().getRequest(); // get request context(with possible modified values)
    const user: UserEntity = req.user;
    return roles.includes(user.role); // Falsy returns results in ForbiddenException
  }
}
