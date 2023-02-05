// Responsible for routing rest api requests

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';
import { MediaRestService } from 'src/application/services/media/media-rest.service';
import { Exception } from 'src/domain/entities/exception';
import { User } from 'src/domain/entities/user';
import { Auth } from 'src/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from 'src/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { SwaggerDoc } from 'src/infrastructure/internals/decorators/swagger-doc.decorator';
import { DeleteMediaReqDTO } from './dtos/req/media/delete-media-req.dto';
import { GetMediaReqDTO } from './dtos/req/media/get-media-req.dto';
import {
  PatchMediaReqBodyDTO,
  PatchMediaReqParamsDTO,
} from './dtos/req/media/patch-media-req.dto';
import { RegisterMediaReqBodyDTO } from './dtos/req/media/register-media-req.dto';
import { SearchMediasReqDTO } from './dtos/req/media/search-medias-req.dto';
import {
  UpdateMediaReqBodyDTO,
  UpdateMediaReqParamsDTO,
} from './dtos/req/media/update-media-req.dto';
import { GetMediaResDTO } from './dtos/res/media/get-media-res.dto';
import { RegisterMediaResDTO } from './dtos/res/media/register-media-res.dto';
import { SearchMediasResDTO } from './dtos/res/media/search-medias-res.dto';
@Controller('/rest/media')
export class MediaControllerEntrypoint {
  // Get services and modules from DI
  constructor(private mediaService: MediaRestService) {}

  // Define and map routes to services

  @Get('/:id')
  @SwaggerDoc({ tag: '/media', description: '' })
  async getMedia(@Param() params: GetMediaReqDTO): Promise<GetMediaResDTO> {
    try {
      return await this.mediaService.getMedia(params);
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

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedias(
    @Query() params: SearchMediasReqDTO,
  ): Promise<SearchMediasResDTO[]> {
    try {
      return await this.mediaService.searchMedias(params);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Post()
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async registerMedia(
    @Body() body: RegisterMediaReqBodyDTO,
    @GetAuthUser() authUser: User,
  ): Promise<RegisterMediaResDTO> {
    try {
      return await this.mediaService.registerMedia({ ...body, user: authUser });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {},
      });
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async deleteMedia(
    @Param() params: DeleteMediaReqDTO,
    @GetAuthUser() authUser: User,
  ): Promise<void> {
    try {
      return await this.mediaService.deleteMedia({ ...params, user: authUser });
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

  @Put('/:id')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async updateMedia(
    @Param() params: UpdateMediaReqParamsDTO,
    @Body() body: UpdateMediaReqBodyDTO,
    @GetAuthUser() authUser: User,
  ): Promise<void> {
    try {
      return await this.mediaService.modifyMedia({
        indexes: { ...params, user: authUser },
        data: body,
      });
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

  @Patch('/:id')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async patchMedia(
    @Param() params: PatchMediaReqParamsDTO,
    @Body() body: PatchMediaReqBodyDTO,
    @GetAuthUser() authUser: User,
  ): Promise<void> {
    try {
      return await this.mediaService.modifyMedia({
        indexes: { ...params, user: authUser },
        data: body,
      });
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
}
