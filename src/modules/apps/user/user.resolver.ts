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
import { Auth } from 'src/modules/apps/auth/decorators/auth.decorator';
import { GetAuthUserEntity } from 'src/modules/apps/auth/decorators/get-auth-user-entity.decorator';
import { GetGraphqlAuthUserInfo } from 'src/modules/apps/auth/decorators/graphql/graphql-user-info.decorator';
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
    @Args() searchUserFilters: SearchUserArgsDTO,
  ): Promise<UserType[]> {
    return this.userGraphqlService.searchUserEntity(searchUserFilters);
  }

  @Mutation(() => UserType, { name: 'registerUser' })
  async registerUser(@Args() user: RegisterUserArgsDTO): Promise<UserType> {
    return this.userGraphqlService.registerUser(user);
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  @Auth('ADMIN')
  async updateUser(@Args() user: UpdateUserArgsDTO): Promise<boolean> {
    await this.userGraphqlService.modifyUserById(user.id, user);

    return true;
  }

  @Mutation(() => Boolean, { name: 'updateCurrentUser' })
  @Auth('ADMIN', 'USER')
  async updateCurrentUser(
    @GetAuthUserEntity() currentUser: UserEntity,
    @Args() user: UpdateCurrentUserArgsDTO,
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
    @Args() searchMediaFilters: SearchMediaArgsDTO,
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
