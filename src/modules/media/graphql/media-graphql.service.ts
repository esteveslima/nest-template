// Responsible for containing business logic, decoupled for graphql resolvers

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRepository } from '../media.repository';

import { UserEntity } from '../../user/user.entity';
import { MediaEntity } from '../media.entity';
import { UpdateMediaArgs } from './args/update-media.args';
import { SearchMediaArgs } from './args/search-media.args';
import { RegisterMediaArgs } from './args/register-media.args';

@Injectable()
export class MediaGraphqlService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRepository)
    private mediaRepository: MediaRepository,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    media: RegisterMediaArgs,
    user: UserEntity,
  ): Promise<MediaEntity> {
    const mediaCreated = await this.mediaRepository.registerMedia({
      ...media,
      user,
    });

    return {
      available: mediaCreated.available,
      contentBase64: mediaCreated.contentBase64,
      createdAt: mediaCreated.createdAt,
      description: mediaCreated.description,
      durationSeconds: mediaCreated.durationSeconds,
      id: mediaCreated.id,
      title: mediaCreated.title,
      type: mediaCreated.type,
      updatedAt: mediaCreated.updatedAt,
      user: mediaCreated.user,
      views: mediaCreated.views,
    };
  }

  async getMediaById(mediaUuid: string): Promise<MediaEntity> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);
    if (!mediaFound) throw new NotFoundException();

    return {
      available: mediaFound.available,
      contentBase64: mediaFound.contentBase64,
      createdAt: mediaFound.createdAt,
      description: mediaFound.description,
      durationSeconds: mediaFound.durationSeconds,
      id: mediaFound.id,
      title: mediaFound.title,
      type: mediaFound.type,
      updatedAt: mediaFound.updatedAt,
      user: mediaFound.user, // assuming user eager loaded(without relations)
      views: mediaFound.views,
    };
  }

  async modifyMediaById(
    mediaUuid: string,
    user: UserEntity,
    modifyMedia: UpdateMediaArgs,
  ): Promise<void> {
    const isModified = await this.mediaRepository.modifyMediaById(
      mediaUuid,
      user,
      modifyMedia,
    );
    if (!isModified) throw new NotFoundException();

    return;
  }

  async deleteMediaById(mediaUuid: string, user: UserEntity): Promise<void> {
    const isDeleted = await this.mediaRepository.deleteMediaById(
      mediaUuid,
      user,
    );
    if (!isDeleted) throw new NotFoundException();

    return;
  }

  async searchMediaEntity(
    searchMediaFilters: SearchMediaArgs,
  ): Promise<MediaEntity[]> {
    const searchFilters = {
      ...searchMediaFilters,
      createdAt: searchMediaFilters.createdAt
        ? new Date(searchMediaFilters.createdAt)
        : undefined,
    };
    const searchResult = await this.mediaRepository.searchMedia(searchFilters);

    return searchResult.map((media) => ({
      available: media.available,
      contentBase64: media.contentBase64,
      createdAt: media.createdAt,
      description: media.description,
      durationSeconds: media.durationSeconds,
      id: media.id,
      title: media.title,
      type: media.type,
      updatedAt: media.updatedAt,
      user: media.user, // removing the relation field in attempt to avoid circular nested objects
      views: media.views,
    }));
  }
}
