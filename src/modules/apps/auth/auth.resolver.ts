// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthGraphqlService } from './services/domain/auth-graphql.service';
import { LoginAuthArgsDTO } from './dtos/graphql/args/login-auth.args';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  // Get services and modules from DI
  constructor(private authGraphqlService: AuthGraphqlService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async loginAuth(@Args() loginAuthArgs: LoginAuthArgsDTO): Promise<string> {
    try {
      const loginToken = await this.authGraphqlService.loginAuth(loginAuthArgs);

      return loginToken;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        AuthUnhauthorized: new UnauthorizedException('Invalid credentials'),
      });
    }
  }
}
