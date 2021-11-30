// Responsible for routing private requests

import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatchMediaDTO } from './dto/patch-media.dto';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { UpdateMediaDTO } from './dto/update-media.dto';
import { MediaService } from './media.service';

import { UserEntity } from '../user/user.entity';
import { IResultServiceRegisterMedia } from './interfaces/service/media/register-media.interface';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';
import { SearchMediaDTO } from './dto/search-media.dto';
import { IResultServiceGetMedia } from './interfaces/service/media/get-media.interface';
import { IResultServiceSearchMedia } from './interfaces/service/media/search-media.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/media')
// Pipes for DTO validations
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
// Interceptor for outputs serialization(applying decorators rules)
@UseInterceptors(ClassSerializerInterceptor)
export class MediaController {
  // Get services and modules from DI
  constructor(private mediaService: MediaService) {}

  // Define and map routes to services

  @Get('/:uuid')
  async getMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): Promise<IResultServiceGetMedia> {
    return this.mediaService.getMediaById(mediaUuid);
  }

  @Get()
  async searchMedia(
    @Query() searchMediaFilters: SearchMediaDTO,
  ): Promise<IResultServiceSearchMedia[]> {
    return this.mediaService.searchMedia(searchMediaFilters);
  }

  @Post()
  @Auth('USER', 'ADMIN')
  async registerMedia(
    @Body() mediaObject: RegisterMediaDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<IResultServiceRegisterMedia> {
    return this.mediaService.registerMedia({
      ...mediaObject,
      user: authUser,
    });
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.deleteMediaById(mediaUuid, authUser);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async updateMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() mediaObject: UpdateMediaDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, {
      ...mediaObject,
      user: authUser,
    });

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() mediaObject: PatchMediaDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, {
      ...mediaObject,
      user: authUser,
    });

    return;
  }
}
