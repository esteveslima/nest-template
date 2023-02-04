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
import { SearchMediasReqDTO } from './dtos/req/search-medias-req.dto';
import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { MediaRestService } from '../../../application/media-rest.service';
import { SearchMediasResDTO } from './dtos/res/search-medias-res.dto';
import { User } from 'src/modules/apps/user/domain/entities/user';
import { GetMediaReqDTO } from './dtos/req/get-media-req.dto';
import { GetMediaResDTO } from './dtos/res/get-media-res.dto';
import { RegisterMediaReqBodyDTO } from './dtos/req/register-media-req.dto';
import { RegisterMediaResDTO } from './dtos/res/register-media-res.dto';
import { DeleteMediaReqDTO } from './dtos/req/delete-media-req.dto';
import {
  UpdateMediaReqBodyDTO,
  UpdateMediaReqParamsDTO,
} from './dtos/req/update-media-req.dto';
import {
  PatchMediaReqBodyDTO,
  PatchMediaReqParamsDTO,
} from './dtos/req/patch-media-req.dto';
import { CustomExceptionMapper } from 'src/common/exceptions/custom-exception-mapper';
import { AllExceptions } from 'src/common/types/all-exceptions.interface';

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

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedias(
    @Query() params: SearchMediasReqDTO,
  ): Promise<SearchMediasResDTO[]> {
    try {
      return await this.mediaService.searchMedias(params);
    } catch (exception) {
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
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
      throw CustomExceptionMapper.mapError<AllExceptions, HttpException>({
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
}
