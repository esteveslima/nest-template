// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Media } from 'src/domain/entities/media';
import { MediaDatabaseModel } from '../models/media.model';
import { IMediaGateway } from 'src/domain/repositories/media/media-gateway.interface';
import { SINGLE_DB } from 'src/infrastructure/config/modules/db/constants';
import { IMediaGatewayRegisterMediaParams } from 'src/domain/repositories/media/methods/register-media.interface';
import { IMediaGatewayGetMediaParams } from 'src/domain/repositories/media/methods/get-media.interface';
import { MediaNotFoundException } from 'src/domain/exceptions/media/media-not-found.exception';
import { IMediaGatewaySearchMediasParams } from 'src/domain/repositories/media/methods/search-media.interface';
import { IMediaGatewayModifyMediaParams } from 'src/domain/repositories/media/methods/modify-media.interface';
import { IMediaGatewayIncrementMediaViewsParams } from 'src/domain/repositories/media/methods/increment-media-views.interface';
import { IMediaGatewayDeleteMediaParams } from 'src/domain/repositories/media/methods/delete-media.interface';

// concrete implementation of the application database dependency
// ideally this layer should also deppend on interfaces, but currently ignoring the dependency rule on this layer towards a more pragmatic approach

@Injectable()
export class MediaDatabaseRepositoryGateway implements IMediaGateway {
  constructor(
    @InjectRepository(MediaDatabaseModel, SINGLE_DB)
    private repository: Repository<MediaDatabaseModel>,
  ) {}

  async registerMedia(
    params: IMediaGatewayRegisterMediaParams,
  ): Promise<Media> {
    const { contentBase64, description, durationSeconds, title, type, user } =
      params;

    const registerOperation = this.repository.create({
      contentBase64,
      description,
      durationSeconds,
      title,
      type,
      user,
    });
    const mediaRegistered = await this.repository.save(registerOperation);
    return mediaRegistered;
  }

  async getMedia(params: IMediaGatewayGetMediaParams): Promise<Media> {
    const { id } = params;

    const mediaFound = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!mediaFound) {
      throw new MediaNotFoundException(params);
    }

    return mediaFound;
  }

  async searchMedias(
    params: IMediaGatewaySearchMediasParams,
  ): Promise<MediaDatabaseModel[]> {
    const {
      available,
      createdAt,
      description,
      durationSeconds,
      title,
      type,
      views,
      username,
      take,
      skip,
    } = params;

    const query = this.repository.createQueryBuilder('media');

    query.leftJoinAndSelect('media.user', 'user'); // load the relation for the query builder

    if (available) {
      // add condition to filter for avilability status
      query.andWhere('media.available = :available', { available });
    }
    if (createdAt) {
      // add condition to filter for min creation date
      query.andWhere('media.createdAt >= :createdAt', {
        createdAt: createdAt,
      });
    }
    if (description) {
      // add condition to filter descriptions containing string
      query.andWhere('media.description LIKE :description', {
        description: `%${description}%`,
      });
    }
    if (durationSeconds) {
      // add condition to filter for min duration
      query.andWhere('media.durationSeconds >= :durationSeconds', {
        durationSeconds,
      });
    }
    if (title) {
      // add condition to filter titles containing string
      query.andWhere('media.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    if (type) {
      // add condition to filter for specific type of media
      query.andWhere('media.type = :type', { type });
    }
    if (views) {
      // add condition to filter for min ammount of views
      query.andWhere('media.views >= :views', {
        views,
      });
    }

    if (username) {
      // add condition to filter media username
      query.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (take) {
      // quantity to return for pagination
      query.take(take); // switch to limit?
    }
    if (skip) {
      // quantity to skip for pagination
      query.skip(skip);
    }

    const searchResult = await query.getMany();

    return searchResult;
  }

  async modifyMedia(params: IMediaGatewayModifyMediaParams): Promise<void> {
    const { data, indexes } = params;
    const {
      available,
      contentBase64,
      description,
      durationSeconds,
      title,
      type,
    } = data;
    const { id, user } = indexes;

    const criteria = { id, user };
    const updateResult = await this.repository.update(criteria, {
      available,
      contentBase64,
      description,
      durationSeconds,
      title,
      type,
    });

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new MediaNotFoundException(indexes);
    }

    return;
  }

  async incrementMediaViews(
    params: IMediaGatewayIncrementMediaViewsParams,
  ): Promise<void> {
    const { id } = params;

    const updateResult = await this.repository.increment({ id }, 'views', 1);

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new MediaNotFoundException(params);
    }

    return;
  }

  async deleteMedia(params: IMediaGatewayDeleteMediaParams): Promise<void> {
    const { id, user } = params;

    const deleteResult = await this.repository.delete({ id, user }); // using user as criteria to allow only the owner

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new MediaNotFoundException(params);
    }

    return;
  }
}
