// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { User } from '../../user/domain/entities/user';
import { MediaPubsubPublisherService } from '../adapters/gateways/publishers/media-pubsub-publisher.service';
import { PatchMediaReqDTO } from '../adapters/entrypoints/controllers/dtos/req/patch-media-req.dto';
import { RegisterMediaReqDTO } from '../adapters/entrypoints/controllers/dtos/req/register-media-req.dto';
import { SearchMediaReqDTO } from '../adapters/entrypoints/controllers/dtos/req/search-media-req.dto';
import { UpdateMediaReqDTO } from '../adapters/entrypoints/controllers/dtos/req/update-media-req.dto';
import { GetMediaResDTO } from '../adapters/entrypoints/controllers/dtos/res/get-media-res.dto';
import { RegisterMediaResDTO } from '../adapters/entrypoints/controllers/dtos/res/register-media-res.dto';
import { SearchMediaResDTO } from '../adapters/entrypoints/controllers/dtos/res/search-media-res.dto';
import { MediaRepository } from '../adapters/gateways/databases/repositories/media.repository';

@Injectable()
export class MediaRestService {
  // Get services and repositories from DI
  constructor(
    private mediaRepository: MediaRepository,

    private mediaPubsubPublisherService: MediaPubsubPublisherService,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    media: RegisterMediaReqDTO,
    user: User,
  ): Promise<RegisterMediaResDTO> {
    const mediaCreated = await this.mediaRepository.registerMedia({
      ...media,
      user,
    });

    return {
      //TODO: create decoupled presenters
      description: mediaCreated.description,
      durationSeconds: mediaCreated.durationSeconds,
      id: mediaCreated.id,
      title: mediaCreated.title,
      type: mediaCreated.type,
    };
  }

  async getMediaById(mediaUuid: string): Promise<GetMediaResDTO> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);

    await this.mediaPubsubPublisherService.publishMediaViewed({
      uuid: mediaUuid,
    });

    return {
      available: mediaFound.available,
      contentBase64: mediaFound.contentBase64,
      createdAt: mediaFound.createdAt,
      description: mediaFound.description,
      durationSeconds: mediaFound.durationSeconds,
      title: mediaFound.title,
      type: mediaFound.type,
      views: mediaFound.views,
      owner: mediaFound.user.username,
    };
  }

  async deleteMediaById(mediaUuid: string, user: User): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid, user);

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    user: User,
    modifyMedia: UpdateMediaReqDTO | PatchMediaReqDTO,
  ): Promise<void> {
    await this.mediaRepository.modifyMediaById(mediaUuid, user, modifyMedia);

    return;
  }

  async searchMedia(
    searchMediaFilters: SearchMediaReqDTO,
  ): Promise<SearchMediaResDTO[]> {
    const createdAtDate = searchMediaFilters.createdAt
      ? new Date(searchMediaFilters.createdAt)
      : undefined;

    const searchFilters = {
      ...searchMediaFilters,
      createdAt: createdAtDate,
    };
    const searchResult = await this.mediaRepository.searchMedia(searchFilters);

    const result = searchResult.map(
      (media): SearchMediaResDTO => ({
        available: media.available,
        createdAt: media.createdAt,
        description: media.description,
        durationSeconds: media.durationSeconds,
        id: media.id,
        title: media.title,
        type: media.type,
        views: media.views,

        username: media.user.username,
      }),
    );

    return result;
  }
}
