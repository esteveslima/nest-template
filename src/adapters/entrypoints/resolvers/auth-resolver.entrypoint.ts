// Responsible for defining resolvers for graphql operations(like controllers)

import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGraphqlService } from '../../../application/services/auth/auth-graphql.service';
import { AuthLoginGraphqlArgsDTO } from './dtos/args/auth/auth-login-graphql-args.dto';
import { Exception } from 'src/domain/entities/exception';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';

@Resolver()
export class AuthResolverEntrypoint {
  // Get services and modules from DI
  constructor(private authGraphqlService: AuthGraphqlService) {}

  // Define resolvers for graphql operations

  @Query(() => String, { name: 'login' })
  async authLogin(@Args() args: AuthLoginGraphqlArgsDTO): Promise<string> {
    try {
      return await this.authGraphqlService.authLogin(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
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
