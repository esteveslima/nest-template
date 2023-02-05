// Responsible for containing business logic, decoupled for graphql resolvers

import { Injectable } from '@nestjs/common';
import { IMediaGraphqlService } from '../../interfaces/services/media/media-graphql/media-graphql.interface';
import {
  IMediaGraphqlServiceRegisterMediaParams,
  IMediaGraphqlServiceRegisterMediaResult,
} from '../../interfaces/services/media/media-graphql/methods/register-media.interface';
import {
  IMediaGraphqlServiceGetMediaParams,
  IMediaGraphqlServiceGetMediaResult,
} from '../../interfaces/services/media/media-graphql/methods/get-media.interface';
import {
  IMediaGraphqlServiceSearchMediasParams,
  IMediaGraphqlServiceSearchMediasResult,
} from '../../interfaces/services/media/media-graphql/methods/search-medias.interface';
import {
  IMediaGraphqlServiceModifyMediaParams,
  IMediaGraphqlServiceModifyMediaResult,
} from '../../interfaces/services/media/media-graphql/methods/modify-media.interface';
import {
  IMediaGraphqlServiceDeleteMediaParams,
  IMediaGraphqlServiceDeleteMediaResult,
} from '../../interfaces/services/media/media-graphql/methods/delete-media.interface';
import { IMediaEventPublisherGateway } from '../../interfaces/ports/media-event-publisher/media-event-publisher-gateway.interface';
import { IMediaGateway } from '../../../domain/repositories/media/media-gateway.interface';

@Injectable()
export class MediaGraphqlService implements IMediaGraphqlService {
  // Get services and repositories from DI
  constructor(
    private mediaGateway: IMediaGateway,
    private mediaEventPublisherGateway: IMediaEventPublisherGateway,
  ) {}

  // Define methods containing business logic

  async registerMedia(
    params: IMediaGraphqlServiceRegisterMediaParams,
  ): Promise<IMediaGraphqlServiceRegisterMediaResult> {
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

  async getMedia(
    params: IMediaGraphqlServiceGetMediaParams,
  ): Promise<IMediaGraphqlServiceGetMediaResult> {
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
      id: mediaFound.id,
      title: mediaFound.title,
      type: mediaFound.type,
      updatedAt: mediaFound.updatedAt,
      user: mediaFound.user, // assuming user eager loaded(without relations)
      views: mediaFound.views,
    };
  }

  async searchMedias(
    params: IMediaGraphqlServiceSearchMediasParams,
  ): Promise<IMediaGraphqlServiceSearchMediasResult> {
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

  async modifyMedia(
    params: IMediaGraphqlServiceModifyMediaParams,
  ): Promise<IMediaGraphqlServiceModifyMediaResult> {
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
    params: IMediaGraphqlServiceDeleteMediaParams,
  ): Promise<IMediaGraphqlServiceDeleteMediaResult> {
    const { id, user } = params;

    await this.mediaGateway.deleteMedia({ id, user });

    return;
  }
}
