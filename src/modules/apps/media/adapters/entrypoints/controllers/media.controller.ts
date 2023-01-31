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
import { UserEntity } from '../../../../user/adapters/gateways/databases/entities/user.entity';
import { PatchMediaReqDTO } from './dtos/req/patch-media-req.dto';
import { RegisterMediaReqDTO } from './dtos/req/register-media-req.dto';
import { UpdateMediaReqDTO } from './dtos/req/update-media-req.dto';
import { SearchMediaReqDTO } from './dtos/req/search-media-req.dto';
import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUserEntity } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user-entity.decorator';
import { MediaRestService } from '../../../application/media-rest.service';
import { SearchMediaResDTO } from './dtos/res/search-media-res.dto';

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
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
      });
    }
  }

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedia(
    @Query() params: SearchMediaReqDTO,
  ): Promise<SearchMediaResDTO[]> {
    try {
      return await this.mediaService.searchMedia(params);
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
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
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
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
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
        MediaNotFound: (customException) =>
          new NotFoundException('Media not found'),
      });
    }
  }
}
