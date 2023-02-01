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
import { MediaType } from './dtos/types/media.type';
import { MediaGraphqlService } from '../../../application/media-graphql.service';
import { UserGraphqlService } from '../../../../user/application/user-graphql.service';
import { UserGraphqlType } from '../../../../user/adapters/entrypoints/resolvers/dtos/types/user-graphql.type';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { GetGraphqlAuthUserInfo } from '../../../../auth/infrastructure/internals/decorators/auth/graphql/graphql-user-info.decorator';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user-entity.decorator';
import { SearchMediaArgsDTO } from './dtos/args/search-media.args';
import { RegisterMediaArgsDTO } from './dtos/args/register-media.args';
import { UpdateMediaArgsDTO } from './dtos/args/update-media.args';
import { User } from 'src/modules/apps/user/domain/entities/user';

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
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
      });
    }
  }

  @Query(() => [MediaType], { name: 'medias' })
  async searchMedias(
    @Args() searchMediaFilters: SearchMediaArgsDTO,
  ): Promise<MediaType[]> {
    try {
      return await this.mediaGraphqlService.searchMedia(searchMediaFilters);
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
    }
  }

  @Mutation(() => MediaType, { name: 'registerMedia' })
  @Auth('ADMIN', 'USER')
  async registerMedia(
    @Args() media: RegisterMediaArgsDTO,
    @GetAuthUser() user: User,
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
    @GetAuthUser() user: User,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.modifyMediaById(media.id, user, media);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteMedia' })
  @Auth('ADMIN', 'USER')
  async deleteMedia(
    @Args('id', ParseUUIDPipe) id: string,
    @GetAuthUser() user: User,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.deleteMediaById(id, user);

      return true;
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
      });
    }
  }

  @ResolveField('user', () => UserGraphqlType, { nullable: true })
  async getMedias(@Parent() media: MediaType): Promise<UserGraphqlType> {
    const userId = media?.user?.id; //TODO: refactor after queries dont do eager loading, the field user should now be only the uuid
    if (!userId) return undefined;

    let user: User;
    try {
      user = await this.userGraphqlService.getUser(userId);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
      });
    }

    return user;
  }
}
