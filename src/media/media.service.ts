// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchMediaDTO } from './dto/search-media.dto';
import { PatchMediaDTO } from './dto/patch-media.dto';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { UpdateMediaDTO } from './dto/update-media.dto';
import { Media } from './media.entity';
import { MediaRespository } from './media.repository';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRespository)
    private mediaRepository: MediaRespository,
  ) {}

  // Define methods containing business logic

  async registerMedia(registerMediaDTO: RegisterMediaDTO): Promise<Media> {
    const mediaCreated = await this.mediaRepository.registerMedia(
      registerMediaDTO,
    );

    return mediaCreated;
  }

  async getMediaById(mediaUuid: string): Promise<Media> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);

    return mediaFound;
  }

  async deleteMediaById(mediaUuid: string): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid);

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    modifyMediaDTO: UpdateMediaDTO | PatchMediaDTO,
  ): Promise<void> {
    await this.mediaRepository.modifyMediaById(mediaUuid, modifyMediaDTO);

    return;
  }

  async searchMedia(searchMediaDTO: SearchMediaDTO): Promise<Media[]> {
    const mediaSearchResult = await this.mediaRepository.searchMedia(
      searchMediaDTO,
    );

    return mediaSearchResult;
  }
}
