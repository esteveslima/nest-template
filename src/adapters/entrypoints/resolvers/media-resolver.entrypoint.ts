// Responsible for defining resolvers for graphql operations(like controllers)

import {
  HttpException,
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
import { MediaGraphqlType } from './dtos/types/media/media-graphql.type';
import { MediaGraphqlService } from '../../../application/services/media/media-graphql.service';
import { UserGraphqlType } from './dtos/types/user/user-graphql.type';
import { User } from 'src/domain/entities/user';
import { DeleteMediaGraphqlArgsDTO } from './dtos/args/media/delete-media-graphql-args.dto';
import { Exception } from 'src/domain/entities/exception';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';
import { GraphqlGetAuthData } from 'src/infrastructure/internals/decorators/auth/graphql/graphql-get-auth-data.decorator';
import { UserGraphqlService } from 'src/application/services/user/user-graphql.service';
import { GetMediaGraphqlArgsDTO } from './dtos/args/media/get-media-graphql-args.dto';
import { SearchMediasGraphqlArgsDTO } from './dtos/args/media/search-media-graphql-args.dto';
import { Auth } from 'src/infrastructure/internals/decorators/auth/auth.decorator';
import { RegisterMediaGraphqlArgsDTO } from './dtos/args/media/register-media-graphql-args.dto';
import { GetAuthUser } from 'src/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { UpdateMediaGraphqlArgsDTO } from './dtos/args/media/update-media-graphql-args.dto';

@Resolver(() => MediaGraphqlType)
@GraphqlGetAuthData() // required for auth field middleware
export class MediaResolverEntrypoint {
  // Get services and modules from DI
  constructor(
    private mediaGraphqlService: MediaGraphqlService,
    private userGraphqlService: UserGraphqlService,
  ) {}

  // Define resolvers for graphql operations

  //TODO: check for n+1 problem on queries and use dataloaders
  @Query(() => MediaGraphqlType, { name: 'media' })
  async getMedia(
    @Args() args: GetMediaGraphqlArgsDTO,
  ): Promise<MediaGraphqlType> {
    try {
      return await this.mediaGraphqlService.getMedia(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFoundException: (e) =>
            new NotFoundException('Media not found'),
        },
      });
    }
  }

  @Query(() => [MediaGraphqlType], { name: 'medias' })
  async searchMedias(
    @Args() args: SearchMediasGraphqlArgsDTO,
  ): Promise<MediaGraphqlType[]> {
    try {
      return await this.mediaGraphqlService.searchMedias(args);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Mutation(() => MediaGraphqlType, { name: 'registerMedia' })
  @Auth('ADMIN', 'USER')
  async registerMedia(
    @Args() args: RegisterMediaGraphqlArgsDTO,
    @GetAuthUser() authUser: User,
  ): Promise<MediaGraphqlType> {
    try {
      return await this.mediaGraphqlService.registerMedia({
        ...args,
        user: authUser,
      });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateMedia' })
  @Auth('ADMIN', 'USER')
  async updateMedia(
    @Args() args: UpdateMediaGraphqlArgsDTO,
    @GetAuthUser() authUser: User,
  ): Promise<boolean> {
    try {
      const { id, ...dataArgs } = args;
      await this.mediaGraphqlService.modifyMedia({
        indexes: { id, user: authUser },
        data: dataArgs,
      });

      return true;
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFoundException: (e) =>
            new NotFoundException('Media not found'),
        },
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteMedia' })
  @Auth('ADMIN', 'USER')
  async deleteMedia(
    @Args() args: DeleteMediaGraphqlArgsDTO,
    @GetAuthUser() authUser: User,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.deleteMedia({ ...args, user: authUser });

      return true;
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFoundException: (e) =>
            new NotFoundException('Media not found'),
        },
      });
    }
  }

  @ResolveField('user', () => UserGraphqlType, { nullable: true })
  async resolveUser(
    @Parent() media: MediaGraphqlType,
  ): Promise<UserGraphqlType> {
    const userId = media?.user?.id; //TODO: refactor after queries dont do eager loading, the field user should now be only the uuid
    if (!userId) return undefined;

    let user: User;
    try {
      user = await this.userGraphqlService.getUser({ id: userId });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }

    return user;
  }
}
