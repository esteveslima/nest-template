// Responsible for routing requests

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
import { SearchMediaDTO } from './dto/search-media.dto';
import { PatchMediaDTO } from './dto/patch-media.dto';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { UpdateMediaDTO } from './dto/update-media.dto';
import { MediaService } from './media.service';
import {
  IResultServiceGetMedia,
  IResultServiceRegisterMedia,
  IResultServiceSearchMedia,
} from './interfaces/media-service-interfaces';

@Controller('media')
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

  @Post()
  async registerMedia(
    @Body() registerMediaDTO: RegisterMediaDTO,
  ): Promise<IResultServiceRegisterMedia> {
    return this.mediaService.registerMedia(registerMediaDTO);
  }

  @Get('/:uuid')
  async getMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): Promise<IResultServiceGetMedia> {
    return this.mediaService.getMediaById(mediaUuid);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): Promise<void> {
    return this.mediaService.deleteMediaById(mediaUuid);
  }

  @Put('/:uuid')
  @HttpCode(204)
  async updateMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() updateMediaDTO: UpdateMediaDTO,
  ): Promise<void> {
    return this.mediaService.modifyMediaById(mediaUuid, updateMediaDTO);
  }

  @Patch('/:uuid')
  @HttpCode(204)
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() patchMediaDTO: PatchMediaDTO,
  ): Promise<void> {
    return this.mediaService.modifyMediaById(mediaUuid, patchMediaDTO);
  }

  @Get()
  async searchMedia(
    @Query() searchMediaDTO: SearchMediaDTO,
  ): Promise<IResultServiceSearchMedia[]> {
    return this.mediaService.searchMedia(searchMediaDTO);
  }
}
