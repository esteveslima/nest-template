// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGraphqlService } from '../../../application/auth-graphql.service';
import { LoginArgsDTO } from './dtos/args/login.args';
import { Exception } from 'src/common/exceptions/exception';
import { Exceptions } from 'src/common/exceptions/exceptions';

@Resolver()
export class AuthResolverEntrypoint {
  // Get services and modules from DI
  constructor(private authGraphqlService: AuthGraphqlService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async login(@Args() args: LoginArgsDTO): Promise<string> {
    try {
      return await this.authGraphqlService.login(args);
    } catch (exception) {
      throw Exception.mapExceptions<Exceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          AuthUnauthorizedException: (e) =>
            new UnauthorizedException('Invalid credentials'),
        },
      });
    }
  }
}
