// Responsible for defining resolvers for graphql operations(like controllers)

import { NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetGraphqlAuthUserInfo } from 'src/modules/apps/auth/internals/decorators/graphql/graphql-user-info.decorator';
import { SearchMediaArgsDTO } from './dtos/graphql/args/search-media.args';
import { RegisterMediaArgsDTO } from './dtos/graphql/args/register-media.args';
import { MediaType } from './models/media.type';
import { GetAuthUserEntity } from 'src/modules/apps/auth/internals/decorators/get-auth-user-entity.decorator';
import { UpdateMediaArgsDTO } from './dtos/graphql/args/update-media.args';
import { Auth } from 'src/modules/apps/auth/internals/decorators/auth.decorator';
import { MediaGraphqlService } from './services/domain/media-graphql.service';
import { UserGraphqlService } from '../user/services/domain/user-graphql.service';
import { UserEntity } from '../user/models/user.entity';
import { UserType } from '../user/models/user.type';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';

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
    try {
      return await this.mediaGraphqlService.getMediaById(id);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @Query(() => [MediaType], { name: 'medias' })
  async searchMedias(
    @Args() searchMediaFilters: SearchMediaArgsDTO,
  ): Promise<MediaType[]> {
    try {
      return await this.mediaGraphqlService.searchMediaEntity(
        searchMediaFilters,
      );
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
    }
  }

  @Mutation(() => MediaType, { name: 'registerMedia' })
  @Auth('ADMIN', 'USER')
  async registerMedia(
    @Args() media: RegisterMediaArgsDTO,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<MediaType> {
    try {
      return await this.mediaGraphqlService.registerMedia(media, user);
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
    }
  }

  @Mutation(() => Boolean, { name: 'updateMedia' })
  @Auth('ADMIN', 'USER')
  async updateMedia(
    @Args() media: UpdateMediaArgsDTO,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.modifyMediaById(media.id, user, media);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteMedia' })
  @Auth('ADMIN', 'USER')
  async deleteMedia(
    @Args('id', ParseUUIDPipe) id: string,
    @GetAuthUserEntity() user: UserEntity,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.deleteMediaById(id, user);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @ResolveField('user', () => UserType, { nullable: true })
  async getMedias(@Parent() media: MediaType): Promise<UserType> {
    const userId = media?.user?.id; //TODO: refactor after queries dont do eager loading, the field user should now be only the uuid
    if (!userId) return undefined;

    let user: UserEntity;
    try {
      user = await this.userGraphqlService.getUserById(userId);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: new NotFoundException('User not found'),
      });
    }

    return user;
  }
}
