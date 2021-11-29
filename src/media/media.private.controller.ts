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

import { AuthGuard } from '@nestjs/passport';
import { GetAuthUser } from 'src/auth/get-auth-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { IResultServiceRegisterMedia } from './interfaces/service/media/register-media.interface';

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
  async deleteMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.deleteMediaById(mediaUuid, authUser);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
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
