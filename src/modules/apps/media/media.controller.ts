// Responsible for routing rest api requests

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MediaRestService } from './services/domain/media-rest.service';
import { UserEntity } from '../user/models/user.entity';

import { PatchMediaReqDTO } from './dtos/rest/req/patch-media-req.dto';
import { RegisterMediaReqDTO } from './dtos/rest/req/register-media-req.dto';
import { UpdateMediaReqDTO } from './dtos/rest/req/update-media-req.dto';
import { SearchMediaReqDTO } from './dtos/rest/req/search-media-req.dto';

import { Auth } from '../auth/internals/decorators/auth.decorator';
import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { GetAuthUserEntity } from '../auth/internals/decorators/get-auth-user-entity.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';

@Controller('/rest/media')
export class MediaController {
  // Get services and modules from DI
  constructor(private mediaService: MediaRestService) {}

  // Define and map routes to services

  @Get('/:uuid')
  @SwaggerDoc({ tag: '/media', description: '' })
  async getMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid: string,
  ): ReturnType<typeof MediaRestService.prototype.getMediaById> {
    try {
      return await this.mediaService.getMediaById(mediaUuid);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedia(
    @Query() searchMediaFilters: SearchMediaReqDTO,
  ): ReturnType<typeof MediaRestService.prototype.searchMedia> {
    try {
      return await this.mediaService.searchMedia(searchMediaFilters);
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
    }
  }

  @Post()
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async registerMedia(
    @Body() mediaObject: RegisterMediaReqDTO,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.registerMedia> {
    try {
      return await this.mediaService.registerMedia(mediaObject, authUser);
    } catch (e) {
      throw CustomException.mapHttpException(e, {});
    }
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid: string,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.deleteMediaById> {
    try {
      return await this.mediaService.deleteMediaById(mediaUuid, authUser);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async updateMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid: string,
    @Body() mediaObject: UpdateMediaReqDTO,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.modifyMediaById> {
    try {
      return await this.mediaService.modifyMediaById(
        mediaUuid,
        authUser,
        mediaObject,
      );
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid: string,
    @Body() mediaObject: PatchMediaReqDTO,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.modifyMediaById> {
    try {
      return await this.mediaService.modifyMediaById(
        mediaUuid,
        authUser,
        mediaObject,
      );
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        MediaNotFound: new NotFoundException('Media not found'),
      });
    }
  }
}
