// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRespository } from './media.repository';

import {
  IParamsServiceRegisterMedia,
  IResultServiceRegisterMedia,
} from './interfaces/service/media/register-media.interface';
import { IParamsServiceModifyMedia } from './interfaces/service/media/modify-media.interface';
import { IResultServiceGetMedia } from './interfaces/service/media/get-media.interface';
import {
  IParamsServiceSearchMedia,
  IResultServiceSearchMedia,
} from './interfaces/service/media/search-media.interface';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRespository)
    private mediaRepository: MediaRespository,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    media: IParamsServiceRegisterMedia,
  ): Promise<IResultServiceRegisterMedia> {
    const mediaCreated = await this.mediaRepository.registerMedia(media);

    const {
      createdAt,
      updatedAt,
      contentBase64,
      views,
      available,
      user,
      ...entityReturnObject
    } = mediaCreated;

    return {
      ...entityReturnObject,
      owner: user.username,
    };
  }

  async getMediaById(mediaUuid: string): Promise<IResultServiceGetMedia> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);

    const { id, updatedAt, user, ...entityReturnObject } = mediaFound;

    await this.mediaRepository.incrementMediaViewsById(mediaUuid);

    return {
      ...entityReturnObject,
      owner: user.username,
    };
  }

  async deleteMediaById(mediaUuid: string, user: UserEntity): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid, user);

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
    searchMediaFilters: IParamsServiceSearchMedia,
  ): Promise<IResultServiceSearchMedia[]> {
    const searchFilters = {
      ...searchMediaFilters,
      createdAt: searchMediaFilters.createdAt
        ? new Date(searchMediaFilters.createdAt)
        : undefined,
    };
    const searchResult = await this.mediaRepository.searchMedia(searchFilters);

    const returnObject = searchResult.map((media) => {
      const { updatedAt, contentBase64, user, ...entityReturnObject } = media;
      return {
        ...entityReturnObject,
        owner: user.username,
      };
    });

    return returnObject;
  }
}
