// Responsible for defining resolvers for graphql operations(like controllers)

import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserGraphqlService } from '../../../application/services/user/user-graphql.service';
import { UserGraphqlType } from './dtos/types/user/user-graphql.type';
import { MediaGraphqlType } from './dtos/types/media/media-graphql.type';
import { MediaDatabaseModel } from '../../gateways/databases/models/media.model';
import { User } from '../../../domain/entities/user';
import { DeleteUserArgsDTO } from './dtos/args/user/delete-user.args';
import { Exception } from 'src/domain/entities/exception';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';
import { GraphqlGetAuthData } from 'src/infrastructure/internals/decorators/auth/graphql/graphql-get-auth-data.decorator';
import { MediaGraphqlService } from 'src/application/services/media/media-graphql.service';
import { GetUserArgsDTO } from './dtos/args/user/get-user.args';
import { SearchUserArgsDTO } from './dtos/args/user/search-user.args';
import { RegisterUserArgsDTO } from './dtos/args/user/register-user.args';
import { Auth } from 'src/infrastructure/internals/decorators/auth/auth.decorator';
import { UpdateUserArgsDTO } from './dtos/args/user/update-user.args';
import { GetAuthUser } from 'src/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { UpdateCurrentUserArgsDTO } from './dtos/args/user/update-current-user.args';
import { SearchMediasArgsDTO } from './dtos/args/media/search-media.args';

@Resolver(() => UserGraphqlType)
@GraphqlGetAuthData() // required for auth field middleware
export class UserResolverEntrypoint {
  // Get services and modules from DI
  constructor(
    private userGraphqlService: UserGraphqlService,
    private mediaGraphqlService: MediaGraphqlService,
  ) {}

  // Define resolvers for graphql operations

  @Query(() => UserGraphqlType, { name: 'user' })
  async getUser(@Args() args: GetUserArgsDTO): Promise<UserGraphqlType> {
    try {
      return await this.userGraphqlService.getUser(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @Query(() => [UserGraphqlType], { name: 'users' })
  async searchUsers(
    @Args() args: SearchUserArgsDTO,
  ): Promise<UserGraphqlType[]> {
    try {
      return await this.userGraphqlService.searchUsers(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @Mutation(() => UserGraphqlType, { name: 'registerUser' })
  async registerUser(
    @Args() args: RegisterUserArgsDTO,
  ): Promise<UserGraphqlType> {
    try {
      return await this.userGraphqlService.registerUser(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserAlreadyExistsException: (e) =>
            new ConflictException('User already exists'),
        },
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  @Auth('ADMIN')
  async updateUser(@Args() args: UpdateUserArgsDTO): Promise<boolean> {
    try {
      const { id, ...data } = args;
      await this.userGraphqlService.modifyUser({ data, indexes: { id } });

      return true;
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateCurrentUser' })
  @Auth('ADMIN', 'USER')
  async updateCurrentUser(
    @GetAuthUser() authUser: User,
    @Args() args: UpdateCurrentUserArgsDTO,
  ): Promise<boolean> {
    try {
      await this.userGraphqlService.modifyUser({
        indexes: { id: authUser.id },
        data: args,
      });

      return true;
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) =>
            new InternalServerErrorException(
              'An error ocurred on getting the current user data',
            ),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @Auth('ADMIN')
  async deleteUser(@Args() args: DeleteUserArgsDTO): Promise<boolean> {
    try {
      await this.userGraphqlService.deleteUser(args);

      return true;
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @ResolveField('medias', () => [MediaGraphqlType], {
    nullable: 'itemsAndList',
  })
  async resolveMedias(
    @Parent() user: UserGraphqlType,
    @Args() args: SearchMediasArgsDTO,
  ): Promise<MediaGraphqlType[]> {
    if (args.username) {
      throw new BadRequestException(
        'Cannot query another user from nested user object',
      );
    }

    const { username } = user;
    let medias: MediaDatabaseModel[];
    try {
      medias = await this.mediaGraphqlService.searchMedias({
        ...args,
        username,
      });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }

    const normalizedMedias = medias.map((media) => {
      // Avoiding circular nested query objects for relation relation (user:media) => (1:N)
      // A media object within an user parent object cannot expose another user object, because it wouldn't add any new information for the result
      media.user = undefined;
      return media;
    });

    return normalizedMedias;
  }
}
