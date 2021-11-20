// Responsible for routing requests

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { Media } from './media.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  // Get services and modules from DI
  constructor(private mediaService: MediaService) {}

  // Define and map routes to services, which contains the business logic
  @Post()
  @UseInterceptors(ClassSerializerInterceptor) // Required for outputs serialization, applying some options like Exclude() // TODO: apply by default, create "private" routes which ignores this config and return full object(or tell postgres which fields to return)
  async registerMedia(
    @Body() registerMediaDTO: RegisterMediaDTO,
  ): Promise<Media> {
    return this.mediaService.registerMedia(registerMediaDTO);
  }

  @Get('/:uuid')
  getMedia(@Param('uuid', ParseUUIDPipe) mediaUuid) {
    console.log(mediaUuid);
    return true;
  }
}
