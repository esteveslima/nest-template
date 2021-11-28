// Responsible for routing private requests

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatchMediaDTO } from './dto/patch-media.dto';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { UpdateMediaDTO } from './dto/update-media.dto';
import { MediaService } from './media.service';
import { IResultServiceRegisterMedia } from './interfaces/media-service-interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('private/media')
// Pipes for DTO validations
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
// Interceptor for outputs serialization(applying decorators rules)
@UseInterceptors(ClassSerializerInterceptor)
// Guards with to protect routes from unhauthorized access
@UseGuards(AuthGuard())
export class MediaPrivateController {
  // Get services and modules from DI
  constructor(private mediaService: MediaService) {}

  // Define and map routes to services

  @Post()
  async registerMedia(
    @Body() registerMediaDTO: RegisterMediaDTO,
  ): Promise<IResultServiceRegisterMedia> {
    return this.mediaService.registerMedia(registerMediaDTO);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): Promise<void> {
    await this.mediaService.deleteMediaById(mediaUuid);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  async updateMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() updateMediaDTO: UpdateMediaDTO,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, updateMediaDTO);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() patchMediaDTO: PatchMediaDTO,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, patchMediaDTO);

    return;
  }
}
