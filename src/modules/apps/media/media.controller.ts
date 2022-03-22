// Responsible for routing rest api requests

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
    return this.mediaService.getMediaById(mediaUuid);
  }

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedia(
    @Query() searchMediaFilters: SearchMediaReqDTO,
  ): ReturnType<typeof MediaRestService.prototype.searchMedia> {
    return this.mediaService.searchMedia(searchMediaFilters);
  }

  @Post()
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async registerMedia(
    @Body() mediaObject: RegisterMediaReqDTO,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.registerMedia> {
    return this.mediaService.registerMedia(mediaObject, authUser);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid: string,
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof MediaRestService.prototype.deleteMediaById> {
    await this.mediaService.deleteMediaById(mediaUuid, authUser);

    return;
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
    await this.mediaService.modifyMediaById(mediaUuid, authUser, mediaObject);

    return;
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
    await this.mediaService.modifyMediaById(mediaUuid, authUser, mediaObject);

    return;
  }
}
