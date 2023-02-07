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
import { DeleteMediaRestRequestDTO } from './dtos/request/media/delete-media-rest-request.dto';
import { GetMediaRestRequestDTO } from './dtos/request/media/get-media-rest-request.dto';
import {
  PatchMediaRestRequestBodyDTO,
  PatchMediaRestRequestParamsDTO,
} from './dtos/request/media/patch-media-rest-request.dto';
import { RegisterMediaRestRequestDTO } from './dtos/request/media/register-media-rest-request.dto';
import { SearchMediasRestRequestDTO } from './dtos/request/media/search-medias-rest-request.dto';
import {
  UpdateMediaRestRequestBodyDTO,
  UpdateMediaRestRequestParamsDTO,
} from './dtos/request/media/update-media-rest-request.dto';
import { GetMediaRestResponseDTO } from './dtos/response/media/get-media-rest-response.dto';
import { RegisterMediaRestResponseDTO } from './dtos/response/media/register-media-rest-response.dto';
import { SearchMediasRestResponseDTO } from './dtos/response/media/search-medias-rest-response.dto';
@Controller('/rest/media')
export class MediaControllerEntrypoint {
  // Get services and modules from DI
  constructor(private mediaService: MediaRestService) {}

  // Define and map routes to services

  @Get('/:id')
  @SwaggerDoc({ tag: '/media', description: '' })
  async getMedia(
    @Param() params: GetMediaRestRequestDTO,
  ): Promise<GetMediaRestResponseDTO> {
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
    @Query() params: SearchMediasRestRequestDTO,
  ): Promise<SearchMediasRestResponseDTO[]> {
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
    @Body() body: RegisterMediaRestRequestDTO,
    @GetAuthUser() authUser: User,
  ): Promise<RegisterMediaRestResponseDTO> {
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
    @Param() params: DeleteMediaRestRequestDTO,
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
    @Param() params: UpdateMediaRestRequestParamsDTO,
    @Body() body: UpdateMediaRestRequestBodyDTO,
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
    @Param() params: PatchMediaRestRequestParamsDTO,
    @Body() body: PatchMediaRestRequestBodyDTO,
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
