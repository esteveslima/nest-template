// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from '../auth.service';
import { LoginAuthArgs } from './args/login-auth.args';

@Resolver()
export class AuthResolver {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async loginAuth(@Args() loginAuthArgs: LoginAuthArgs): Promise<string> {
    const loginPayload = await this.authService.loginAuth(loginAuthArgs);
    const { token } = loginPayload;

    return token;
  }
}
