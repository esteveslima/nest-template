// Responsible for containing business logic

import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from '../database/repositories/media.repository';

import { UserEntity } from '../../../user/models/user.entity';
import { RegisterMediaReqDTO } from '../../dtos/rest/req/register-media-req.dto';
import { UpdateMediaReqDTO } from '../../dtos/rest/req/update-media-req.dto';
import { PatchMediaReqDTO } from '../../dtos/rest/req/patch-media-req.dto';
import { SearchMediaReqDTO } from '../../dtos/rest/req/search-media-req.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventMediaViewed } from '../../interfaces/services/domain/events/listeners/media-viewed.interface';
import { MEDIA_VIEWED } from './events/listeners/constants';
import { GetMediaResDTO } from '../../dtos/rest/res/get-media-res.dto';
import { RegisterMediaResDTO } from '../../dtos/rest/res/register-media-res.dto';
import { SearchMediaResDTO } from '../../dtos/rest/res/search-media-res.dto';

@Injectable()
export class MediaRestService {
  // Get services and repositories from DI
  constructor(
    private mediaRepository: MediaRepository,

    private eventEmitter: EventEmitter2,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    media: RegisterMediaReqDTO,
    user: UserEntity,
  ): Promise<RegisterMediaResDTO> {
    const mediaCreated = await this.mediaRepository.registerMedia({
      ...media,
      user,
    });

    return {
      description: mediaCreated.description,
      durationSeconds: mediaCreated.durationSeconds,
      id: mediaCreated.id,
      title: mediaCreated.title,
      type: mediaCreated.type,
    };
  }

  async getMediaById(mediaUuid: string): Promise<GetMediaResDTO> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);
    if (!mediaFound) throw new NotFoundException();

    await this.eventEmitter.emitAsync(MEDIA_VIEWED, {
      uuid: mediaUuid,
    } as IEventMediaViewed); //TODO: find type-safety for events by name and check if it doesn't hurt the purporse for this decoupled architecture

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

  async deleteMediaById(mediaUuid: string, user: UserEntity): Promise<void> {
    const isDeleted = await this.mediaRepository.deleteMediaById(
      mediaUuid,
      user,
    );
    if (!isDeleted) throw new NotFoundException();

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    user: UserEntity,
    modifyMedia: UpdateMediaReqDTO | PatchMediaReqDTO,
  ): Promise<void> {
    const isModified = await this.mediaRepository.modifyMediaById(
      mediaUuid,
      user,
      modifyMedia,
    );
    if (!isModified) throw new NotFoundException();

    return;
  }

  async searchMedia(
    searchMediaFilters: SearchMediaReqDTO,
  ): Promise<SearchMediaResDTO[]> {
    const searchFilters = {
      ...searchMediaFilters,
      createdAt: searchMediaFilters.createdAt
        ? new Date(searchMediaFilters.createdAt)
        : undefined,
    };
    const searchResult = await this.mediaRepository.searchMedia(searchFilters);
    if (searchResult.length <= 0) throw new NotFoundException();

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
