// Responsible for defining resolvers for graphql operations(like controllers)

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Auth } from 'src/modules/apps/auth/internals/decorators/auth.decorator';
import { GetAuthUserEntity } from 'src/modules/apps/auth/internals/decorators/get-auth-user-entity.decorator';
import { GetGraphqlAuthUserInfo } from 'src/modules/apps/auth/internals/decorators/graphql/graphql-user-info.decorator';
import { UserGraphqlService } from './services/domain/user-graphql.service';
import { UserEntity } from './models/user.entity';
import { RegisterUserArgsDTO } from './dtos/graphql/args/register-user.args';
import { SearchUserArgsDTO } from './dtos/graphql/args/search-user.args';
import { UpdateCurrentUserArgsDTO } from './dtos/graphql/args/update-current-user.args';
import { UpdateUserArgsDTO } from './dtos/graphql/args/update-user.args';
import { UserType } from './models/user.type';
import { MediaGraphqlService } from '../media/services/domain/media-graphql.service';
import { MediaType } from '../media/models/media.type';
import { SearchMediaArgsDTO } from '../media/dtos/graphql/args/search-media.args';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { MediaEntity } from '../media/models/media.entity';

@Resolver(() => UserType)
@GetGraphqlAuthUserInfo() // required for auth field middleware
export class UserResolver {
  // Get services and modules from DI
  constructor(
    private userGraphqlService: UserGraphqlService,
    private mediaGraphqlService: MediaGraphqlService,
  ) {}

  // Define resolvers for graphql operations

  @Query(() => UserType, { name: 'user' })
  async getUserById(@Args('id', ParseUUIDPipe) id: string): Promise<UserType> {
    try {
      return await this.userGraphqlService.getUserById(id);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new NotFoundException('User not found'),
      });
    }
  }

  @Query(() => [UserType], { name: 'users' })
  async searchUsers(
    @Args() searchUserFilters: SearchUserArgsDTO,
  ): Promise<UserType[]> {
    try {
      return await this.userGraphqlService.searchUsersEntity(searchUserFilters);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new NotFoundException('User not found'),
      });
    }
  }

  @Mutation(() => UserType, { name: 'registerUser' })
  async registerUser(@Args() user: RegisterUserArgsDTO): Promise<UserType> {
    try {
      return await this.userGraphqlService.registerUser(user);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserAlreadyExists: new ConflictException('User already exists'),
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  @Auth('ADMIN')
  async updateUser(@Args() user: UpdateUserArgsDTO): Promise<boolean> {
    try {
      await this.userGraphqlService.modifyUserById(user.id, user);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new NotFoundException('User not found'),
        UserUpdateFail: new BadRequestException('Update data not accepted'),
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateCurrentUser' })
  @Auth('ADMIN', 'USER')
  async updateCurrentUser(
    @GetAuthUserEntity() currentUser: UserEntity,
    @Args() user: UpdateCurrentUserArgsDTO,
  ): Promise<boolean> {
    try {
      await this.userGraphqlService.modifyUserById(currentUser.id, user);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new InternalServerErrorException(
          'An error ocurred on getting the current user data',
        ),
        UserUpdateFail: new BadRequestException('Update data not accepted'),
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @Auth('ADMIN')
  async deleteUser(@Args('id', ParseUUIDPipe) id: string): Promise<boolean> {
    try {
      await this.userGraphqlService.deleteUserById(id);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new NotFoundException('User not found'),
      });
    }
  }

  @ResolveField('medias', () => [MediaType], { nullable: 'itemsAndList' })
  async getMedias(
    @Parent() user: UserType,
    @Args() searchMediaFilters: SearchMediaArgsDTO,
  ): Promise<MediaType[]> {
    if (searchMediaFilters.username) {
      throw new BadRequestException(
        'Cannot query another user from nested user object',
      );
    }

    const { username } = user;
    let medias: MediaEntity[];
    try {
      medias = await this.mediaGraphqlService.searchMediaEntity({
        ...searchMediaFilters,
        username,
      });
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
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
