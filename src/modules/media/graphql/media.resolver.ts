// Responsible for defining resolvers for graphql operations(like controllers)

import { ParseUUIDPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetGraphqlAuthUserInfo } from 'src/modules/auth/decorators/graphql/graphql-user-info.decorator';
import { UserType } from 'src/modules/user/graphql/user.type';
import { SearchMediaArgs } from './args/search-media.args';
import { RegisterMediaArgs } from './args/register-media.args';

import { MediaType } from './media.type';

import { GetAuthUserEntity } from 'src/modules/auth/decorators/get-auth-user-entity.decorator';
import { UserEntity } from 'src/modules/user/user.entity';
import { UpdateMediaArgs } from './args/update-media.args';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { MediaGraphqlService } from './media-graphql.service';
import { UserGraphqlService } from 'src/modules/user/graphql/user-graphql.service';

@Resolver(() => MediaType)
@GetGraphqlAuthUserInfo() // required for auth field middleware
export class MediaResolver {
  // Get services and modules from DI
  constructor(
    private mediaGraphqlService: MediaGraphqlService,
    private userGraphqlService: UserGraphqlService,
  ) {}

  // Define resolvers for graphql operations

  //TODO: check for n+1 problem on queries and use dataloaders
  @Query(() => MediaType, { name: 'media' })
  async getMediaById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<MediaType> {
    return this.mediaGraphqlService.getMediaById(id);
  }

  @Query(() => [MediaType], { name: 'medias' })
  async searchMedias(
    @Args() searchMediaFilters: SearchMediaArgs,
  ): Promise<MediaType[]> {
    return this.mediaGraphqlService.searchMediaEntity(searchMediaFilters);
  }

  @Mutation(() => MediaType, { name: 'registerMedia' })
  @Auth('ADMIN', 'USER')
  async registerMedia(
    @Args() media: RegisterMediaArgs,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<MediaType> {
    return this.mediaGraphqlService.registerMedia(media, user);
  }

  @Mutation(() => Boolean, { name: 'updateMedia' })
  @Auth('ADMIN', 'USER')
  async updateMedia(
    @Args() media: UpdateMediaArgs,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<boolean> {
    await this.mediaGraphqlService.modifyMediaById(media.id, user, media);

    return true;
  }

  @Mutation(() => Boolean, { name: 'deleteMedia' })
  @Auth('ADMIN', 'USER')
  async deleteMedia(
    @Args('id', ParseUUIDPipe) id: string,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<boolean> {
    await this.mediaGraphqlService.deleteMediaById(id, user);

    return true;
  }

  @ResolveField('user', () => UserType, { nullable: true })
  async getMedias(@Parent() media: MediaType): Promise<UserType> {
    const userId = media?.user?.id; //TODO: refactor after queries dont do eager loading, the field user should now be only the uuid

    const user = await this.userGraphqlService.getUserById(userId);

    return user;
  }
}
