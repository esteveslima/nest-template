// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGraphqlService } from '../../../application/auth-graphql.service';
import { LoginArgsDTO } from './dtos/args/login.args';
@Resolver()
export class AuthResolver {
  // Get services and modules from DI
  constructor(private authGraphqlService: AuthGraphqlService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async login(@Args() args: LoginArgsDTO): Promise<string> {
    try {
      return await this.authGraphqlService.login(args);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        AuthUnhauthorized: (customException) =>
          new UnauthorizedException('Invalid credentials'),
      });
    }
  }
}
