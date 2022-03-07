// Responsible for defining resolvers for graphql operations(like controllers)

import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { GetAuthUserEntity } from 'src/modules/auth/decorators/get-auth-user-entity.decorator';
import { GetGraphqlAuthUserInfo } from 'src/modules/auth/decorators/graphql/graphql-user-info.decorator';
import { SearchMediaArgs } from 'src/modules/media/graphql/args/search-media.args';
import { MediaType } from 'src/modules/media/graphql/media.type';

import { UserGraphqlService } from './user-graphql.service';
import { UserEntity } from '../user.entity';
import { RegisterUserArgs } from './args/register-user.args';
import { SearchUserArgs } from './args/search-user.args';
import { UpdateCurrentUserArgs } from './args/update-current-user.args';
import { UpdateUserArgs } from './args/update-user.args';
import { UserType } from './user.type';
import { MediaGraphqlService } from 'src/modules/media/graphql/media-graphql.service';

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
    return this.userGraphqlService.getUserById(id);
  }

  @Query(() => [UserType], { name: 'users' })
  async searchUsers(
    @Args() searchUserFilters: SearchUserArgs,
  ): Promise<UserType[]> {
    return this.userGraphqlService.searchUserEntity(searchUserFilters);
  }

  @Mutation(() => UserType, { name: 'registerUser' })
  async registerUser(@Args() user: RegisterUserArgs): Promise<UserType> {
    return this.userGraphqlService.registerUser(user);
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  @Auth('ADMIN')
  async updateUser(@Args() user: UpdateUserArgs): Promise<boolean> {
    await this.userGraphqlService.modifyUserById(user.id, user);

    return true;
  }

  @Mutation(() => Boolean, { name: 'updateCurrentUser' })
  @Auth('ADMIN', 'USER')
  async updateCurrentUser(
    @GetAuthUserEntity() currentUser: UserEntity,
    @Args() user: UpdateCurrentUserArgs,
  ): Promise<boolean> {
    await this.userGraphqlService.modifyUserById(currentUser.id, user);

    return true;
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @Auth('ADMIN')
  async deleteUser(@Args('id', ParseUUIDPipe) id: string): Promise<boolean> {
    await this.userGraphqlService.deleteUserById(id);

    return true;
  }

  @ResolveField('medias', () => [MediaType], { nullable: 'itemsAndList' })
  async getMedias(
    @Parent() user: UserType,
    @Args() searchMediaFilters: SearchMediaArgs,
  ): Promise<MediaType[]> {
    if (searchMediaFilters.username) {
      throw new BadRequestException(
        'Cannot query another user from nested user object',
      );
    }

    const { username } = user;
    const medias = await this.mediaGraphqlService.searchMediaEntity({
      ...searchMediaFilters,
      username,
    });

    const normalizedMedias = medias.map((media) => {
      // Avoiding circular nested query objects for relation relation (user:media) => (1:N)
      // A media object with an user parent object cannot expose another user object, because it wouldn't add any new information for the result
      media.user = undefined;
      return media;
    });

    return normalizedMedias;
  }
}
