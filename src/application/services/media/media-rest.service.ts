// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { IMediaEventPublisherGateway } from 'src/application/interfaces/ports/media-event-publisher/media-event-publisher-gateway.interface';
import { IMediaRestService } from 'src/application/interfaces/services/media/media-rest/media-rest.interface';
import {
  IMediaRestServiceDeleteMediaParams,
  IMediaRestServiceDeleteMediaResult,
} from 'src/application/interfaces/services/media/media-rest/methods/delete-media.interface';
import {
  IMediaRestServiceGetMediaParams,
  IMediaRestServiceGetMediaResult,
} from 'src/application/interfaces/services/media/media-rest/methods/get-media.interface';
import {
  IMediaRestServiceModifyMediaParams,
  IMediaRestServiceModifyMediaResult,
} from 'src/application/interfaces/services/media/media-rest/methods/modify-media.interface';
import {
  IMediaRestServiceRegisterMediaParams,
  IMediaRestServiceRegisterMediaResult,
} from 'src/application/interfaces/services/media/media-rest/methods/register-media.interface';
import {
  IMediaRestServiceSearchMediasParams,
  IMediaRestServiceSearchMediasResult,
} from 'src/application/interfaces/services/media/media-rest/methods/search-medias.interface';
import { IMediaGateway } from 'src/domain/repositories/media/media-gateway.interface';

@Injectable()
export class MediaRestService implements IMediaRestService {
  // Get services and repositories from DI
  constructor(
    private mediaGateway: IMediaGateway,
    private mediaEventPublisherGateway: IMediaEventPublisherGateway,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    params: IMediaRestServiceRegisterMediaParams,
  ): Promise<IMediaRestServiceRegisterMediaResult> {
    const { contentBase64, description, durationSeconds, title, type, user } =
      params;

    const mediaCreated = await this.mediaGateway.registerMedia({
      contentBase64,
      description,
      durationSeconds,
      title,
      type,
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

  async getMedia(
    params: IMediaRestServiceGetMediaParams,
  ): Promise<IMediaRestServiceGetMediaResult> {
    const { id } = params;

    const mediaFound = await this.mediaGateway.getMedia({ id });

    await this.mediaEventPublisherGateway.publishMediaViewed({
      id,
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

  async searchMedias(
    params: IMediaRestServiceSearchMediasParams,
  ): Promise<IMediaRestServiceSearchMediasResult> {
    const {
      available,
      createdAt,
      description,
      durationSeconds,
      skip,
      take,
      title,
      type,
      username,
      views,
    } = params;

    const createdAtDate = createdAt ? new Date(createdAt) : undefined;
    const searchFilters = {
      available,
      description,
      durationSeconds,
      skip,
      take,
      title,
      type,
      username,
      views,
      createdAt: createdAtDate,
    };

    const searchResult = await this.mediaGateway.searchMedias(searchFilters);

    const result = searchResult.map<IMediaRestServiceSearchMediasResult[0]>(
      (media) => ({
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

  async modifyMedia(
    params: IMediaRestServiceModifyMediaParams,
  ): Promise<IMediaRestServiceModifyMediaResult> {
    const { data, indexes } = params;
    const { id, user } = indexes;
    const {
      available,
      contentBase64,
      description,
      durationSeconds,
      title,
      type,
    } = data;

    await this.mediaGateway.modifyMedia({
      indexes: { id, user },
      data: {
        available,
        contentBase64,
        description,
        durationSeconds,
        title,
        type,
      },
    });

    return;
  }

  async deleteMedia(
    params: IMediaRestServiceDeleteMediaParams,
  ): Promise<IMediaRestServiceDeleteMediaResult> {
    const { id, user } = params;

    await this.mediaGateway.deleteMedia({ id, user });

    return;
  }
}
