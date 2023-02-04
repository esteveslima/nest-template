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
import { MediaGraphqlType } from './dtos/types/media-graphql.type';
import { MediaGraphqlService } from '../../../application/media-graphql.service';
import { UserGraphqlService } from '../../../../user/application/user-graphql.service';
import { UserGraphqlType } from '../../../../user/adapters/entrypoints/resolvers/dtos/types/user-graphql.type';
import { GetGraphqlAuthData } from '../../../../auth/infrastructure/internals/decorators/auth/graphql/graphql-auth-data.decorator';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { SearchMediasArgsDTO } from './dtos/args/search-media.args';
import { RegisterMediaArgsDTO } from './dtos/args/register-media.args';
import { UpdateMediaArgsDTO } from './dtos/args/update-media.args';
import { User } from 'src/modules/apps/user/domain/entities/user';
import { GetMediaArgsDTO } from './dtos/args/get-media.args';
import { DeleteMediaArgsDTO } from './dtos/args/delete-media.args';
import { CustomExceptionMapper } from 'src/common/exceptions/custom-exception-mapper';
import { ApplicationExceptions } from 'src/common/exceptions/application-exceptions';
import { AllExceptions } from 'src/common/types/all-exceptions.interface';

@Resolver(() => MediaGraphqlType)
@GetGraphqlAuthData() // required for auth field middleware
export class MediaResolverEntrypoint {
  // Get services and modules from DI
  constructor(
    private mediaGraphqlService: MediaGraphqlService,
    private userGraphqlService: UserGraphqlService,
  ) {}

  // Define resolvers for graphql operations

  //TODO: check for n+1 problem on queries and use dataloaders
  @Query(() => MediaGraphqlType, { name: 'media' })
  async getMedia(@Args() args: GetMediaArgsDTO): Promise<MediaGraphqlType> {
    try {
      return await this.mediaGraphqlService.getMedia(args);
    } catch (exception) {
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFound: (customException) =>
            new NotFoundException('Media not found'),
        },
      });
    }
  }

  @Query(() => [MediaGraphqlType], { name: 'medias' })
  async searchMedias(
    @Args() args: SearchMediasArgsDTO,
  ): Promise<MediaGraphqlType[]> {
    try {
      return await this.mediaGraphqlService.searchMedias(args);
    } catch (exception) {
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Mutation(() => MediaGraphqlType, { name: 'registerMedia' })
  @Auth('ADMIN', 'USER')
  async registerMedia(
    @Args() args: RegisterMediaArgsDTO,
    @GetAuthUser() authUser: User,
  ): Promise<MediaGraphqlType> {
    try {
      return await this.mediaGraphqlService.registerMedia({
        ...args,
        user: authUser,
      });
    } catch (exception) {
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Mutation(() => Boolean, { name: 'updateMedia' })
  @Auth('ADMIN', 'USER')
  async updateMedia(
    @Args() args: UpdateMediaArgsDTO,
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFound: (customException) =>
            new NotFoundException('Media not found'),
        },
      });
    }
  }

  @Mutation(() => Boolean, { name: 'deleteMedia' })
  @Auth('ADMIN', 'USER')
  async deleteMedia(
    @Args() args: DeleteMediaArgsDTO,
    @GetAuthUser() authUser: User,
  ): Promise<boolean> {
    try {
      await this.mediaGraphqlService.deleteMedia({ ...args, user: authUser });

      return true;
    } catch (exception) {
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          MediaNotFound: (customException) =>
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFound: (customException) =>
            new NotFoundException('User not found'),
        },
      });
    }

    return user;
  }
}
