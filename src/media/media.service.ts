// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRespository } from './media.repository';
import {
  IParamsServiceModifyMedia,
  IParamsServiceRegisterMedia,
  IParamsServiceSearchMedia,
  IResultServiceGetMedia,
  IResultServiceRegisterMedia,
  IResultServiceSearchMedia,
} from './interfaces/media-service-interfaces';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRespository)
    private mediaRepository: MediaRespository,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    registerMedia: IParamsServiceRegisterMedia,
  ): Promise<IResultServiceRegisterMedia> {
    const mediaCreated = await this.mediaRepository.registerMedia(
      registerMedia,
    );

    return mediaCreated;
  }

  async getMediaById(mediaUuid: string): Promise<IResultServiceGetMedia> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);

    return mediaFound;
  }

  async deleteMediaById(mediaUuid: string): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid);

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    modifyMedia: IParamsServiceModifyMedia,
  ): Promise<void> {
    await this.mediaRepository.modifyMediaById(mediaUuid, modifyMedia);

    return;
  }

  async searchMedia(
    searchMedia: IParamsServiceSearchMedia,
  ): Promise<IResultServiceSearchMedia[]> {
    const searchFilters = {
      ...searchMedia,
      createdAt: searchMedia.createdAt && new Date(searchMedia.createdAt),
    };
    const mediaSearchResult = await this.mediaRepository.searchMedia(
      searchFilters,
    );

    return mediaSearchResult;
  }
}
