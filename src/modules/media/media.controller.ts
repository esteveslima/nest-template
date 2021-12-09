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
import { MediaService } from './media.service';
import { UserEntity } from '../user/user.entity';

import { PatchMediaReqDTO } from './dto/req/patch-media-req.dto';
import { RegisterMediaReqDTO } from './dto/req/register-media-req.dto';
import { RegisterMediaResDTO } from './dto/res/register-media-res.dto';
import { UpdateMediaReqDTO } from './dto/req/update-media-req.dto';
import { SearchMediaReqDTO } from './dto/req/search-media-req.dto';
import { SearchMediaResDTO } from './dto/res/search-media-res.dto';
import { GetMediaResDTO } from './dto/res/get-media-res.dto';

import { Log } from '../../decorators/log.decorator';
import { SerializeOutput } from '../../decorators/serialize-output.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';

@Controller('/media')
@UsePipes(new ValidationPipe({ whitelist: true })) // Pipes for validating request DTO, removing undeclared properties
@UseInterceptors(ClassSerializerInterceptor) // Interceptor for input serialization, applying decorators transformation rules
@Log('MediaController') // Custom log interceptor
export class MediaController {
  // Get services and modules from DI
  constructor(private mediaService: MediaService) {}

  // Define and map routes to services

  @Get('/:uuid')
  @SerializeOutput(GetMediaResDTO)
  async getMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
  ): Promise<GetMediaResDTO> {
    return this.mediaService.getMediaById(mediaUuid);
  }

  @Get()
  @SerializeOutput(SearchMediaResDTO)
  async searchMedia(
    @Query() searchMediaFilters: SearchMediaReqDTO,
  ): Promise<SearchMediaResDTO[]> {
    return this.mediaService.searchMedia(searchMediaFilters);
  }

  @Post()
  @Auth('USER', 'ADMIN')
  @SerializeOutput(RegisterMediaResDTO)
  async registerMedia(
    @Body() mediaObject: RegisterMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<RegisterMediaResDTO> {
    return this.mediaService.registerMedia(mediaObject, authUser);
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
    @Body() mediaObject: UpdateMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, mediaObject, authUser);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async patchMediaById(
    @Param('uuid', ParseUUIDPipe) mediaUuid,
    @Body() mediaObject: PatchMediaReqDTO,
    @GetAuthUser() authUser: UserEntity,
  ): Promise<void> {
    await this.mediaService.modifyMediaById(mediaUuid, mediaObject, authUser);

    return;
  }
}
