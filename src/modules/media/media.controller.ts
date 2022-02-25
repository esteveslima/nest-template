// Responsible for routing private requests

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
import { MediaService } from './media.service';
import { UserEntity } from '../user/user.entity';

import { PatchMediaReqDTO } from './dto/req/patch-media-req.dto';
import { RegisterMediaReqDTO } from './dto/req/register-media-req.dto';
import { UpdateMediaReqDTO } from './dto/req/update-media-req.dto';
import { SearchMediaReqDTO } from './dto/req/search-media-req.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';
import { SwaggerDoc } from 'src/common/decorators/swagger-doc.decorator';

@Controller('/rest/media')
export class MediaController {
  // Get services and modules from DI
  constructor(private mediaService: MediaService) {}

  // Define and map routes to services

  @Get('/:uuid')
  @SwaggerDoc({ tag: '/media', description: '' })
  async getMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): ReturnType<typeof MediaService.prototype.getMediaById> {
    return this.mediaService.getMediaById(mediaUuid);
  }

  @Get()
  @SwaggerDoc({ tag: '/media', description: '' })
  async searchMedia(
    @Query() searchMediaFilters: SearchMediaReqDTO,
  ): ReturnType<typeof MediaService.prototype.searchMedia> {
    return this.mediaService.searchMedia(searchMediaFilters);
  }

  @Post()
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async registerMedia(
    @Body() mediaObject: RegisterMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): ReturnType<typeof MediaService.prototype.registerMedia> {
    return this.mediaService.registerMedia(mediaObject, authUser);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @GetAuthUser() authUser: UserEntity,
  ): ReturnType<typeof MediaService.prototype.deleteMediaById> {
    await this.mediaService.deleteMediaById(mediaUuid, authUser);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async updateMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() mediaObject: UpdateMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): ReturnType<typeof MediaService.prototype.modifyMediaById> {
    await this.mediaService.modifyMediaById(mediaUuid, authUser, mediaObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/media', description: '', authEnabled: true })
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() mediaObject: PatchMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): ReturnType<typeof MediaService.prototype.modifyMediaById> {
    await this.mediaService.modifyMediaById(mediaUuid, authUser, mediaObject);

    return;
  }
}
