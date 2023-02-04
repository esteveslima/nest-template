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
import { UserGraphqlService } from '../../../application/user-graphql.service';
import { RegisterUserArgsDTO } from './dtos/args/register-user.args';
import { UserGraphqlType } from './dtos/types/user-graphql.type';
import { MediaGraphqlService } from '../../../../media/application/media-graphql.service';
import { MediaGraphqlType } from '../../../../media/adapters/entrypoints/resolvers/dtos/types/media-graphql.type';
import { MediaDatabaseModel } from '../../../../media/adapters/gateways/databases/models/media.model';
import { GetGraphqlAuthData } from '../../../../auth/infrastructure/internals/decorators/auth/graphql/graphql-auth-data.decorator';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { SearchMediasArgsDTO } from '../../../../media/adapters/entrypoints/resolvers/dtos/args/search-media.args';
import { SearchUserArgsDTO } from './dtos/args/search-user.args';
import { UpdateUserArgsDTO } from './dtos/args/update-user.args';
import { UpdateCurrentUserArgsDTO } from './dtos/args/update-current-user.args';
import { User } from '../../../domain/entities/user';
import { GetUserArgsDTO } from './dtos/args/get-user.args';
import { DeleteUserArgsDTO } from './dtos/args/delete-user.args';
import { CustomExceptionMapper } from 'src/common/exceptions/custom-exception-mapper';
import { AllExceptions } from 'src/common/types/all-exceptions.interface';

@Resolver(() => UserGraphqlType)
@GetGraphqlAuthData() // required for auth field middleware
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new NotFoundException('User not found'),
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new NotFoundException('User not found'),
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserAlreadyExists: (customException) =>
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new NotFoundException('User not found'),
          UserUpdateFail: (customException) =>
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new InternalServerErrorException(
              'An error ocurred on getting the current user data',
            ),
          UserUpdateFail: (customException) =>
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new NotFoundException('User not found'),
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
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
