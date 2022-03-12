// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthGraphqlService } from './services/domain/auth-graphql.service';
import { LoginAuthArgsDTO } from './dtos/graphql/args/login-auth.args';

@Resolver()
export class AuthResolver {
  // Get services and modules from DI
  constructor(private authGraphqlService: AuthGraphqlService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async loginAuth(@Args() loginAuthArgs: LoginAuthArgsDTO): Promise<string> {
    const loginToken = await this.authGraphqlService.loginAuth(loginAuthArgs);

    return loginToken;
  }
}
