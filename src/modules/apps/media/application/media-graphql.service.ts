// Responsible for containing business logic, decoupled for graphql resolvers

import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from '../adapters/gateways/databases/repositories/media.repository';
import { RegisterMediaArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/register-media.args';
import { UpdateMediaArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/update-media.args';
import { SearchMediaArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/search-media.args';
import { Media } from '../domain/media.interface';
import { User } from '../../user/domain/user.interface';

@Injectable()
export class MediaGraphqlService {
  // Get services and repositories from DI
  constructor(private mediaRepository: MediaRepository) {}

  // Define methods containing business logic

  async registerMedia(media: RegisterMediaArgsDTO, user: User): Promise<Media> {
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

  async getMediaById(mediaUuid: string): Promise<Media> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);

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
    user: User,
    modifyMedia: UpdateMediaArgsDTO,
  ): Promise<void> {
    await this.mediaRepository.modifyMediaById(mediaUuid, user, modifyMedia);

    return;
  }

  async deleteMediaById(mediaUuid: string, user: User): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid, user);

    return;
  }

  async searchMedia(searchMediaFilters: SearchMediaArgsDTO): Promise<Media[]> {
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
