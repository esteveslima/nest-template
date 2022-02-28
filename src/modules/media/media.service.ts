// Responsible for containing business logic

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRepository } from './media.repository';

import { UserEntity } from '../user/user.entity';
import { SearchMediaResDTO } from './dto/res/search-media-res.dto';
import { RegisterMediaResDTO } from './dto/res/register-media-res.dto';
import { GetMediaResDTO } from './dto/res/get-media-res.dto';
import { RegisterMediaReqDTO } from './dto/req/register-media-req.dto';
import { UpdateMediaReqDTO } from './dto/req/update-media-req.dto';
import { PatchMediaReqDTO } from './dto/req/patch-media-req.dto';
import { SearchMediaReqDTO } from './dto/req/search-media-req.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventMediaViewed } from './interfaces/events/media-viewed.interface';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRepository)
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

    await this.eventEmitter.emitAsync('media.viewed', {
      uuid: mediaUuid,
    } as IEventMediaViewed);

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

        owner: media.user.username,
      }),
    );

    return result;
  }
}
