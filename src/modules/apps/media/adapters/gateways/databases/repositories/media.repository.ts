// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MediaEntity } from '../entities/media.entity';
import { User } from '../../../../../user/domain/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { IParamsRepositoryRegisterMedia } from './types/register-media.interface';
import { IParamsRepositoryModifyMedia } from './types/modify-media.interface';
import { IParamsRepositorySearchMedia } from './types/search-media.interface';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectRepository(MediaEntity, SINGLE_DB)
    private repository: Repository<MediaEntity>,
  ) {}

  async registerMedia(
    media: IParamsRepositoryRegisterMedia,
  ): Promise<MediaEntity> {
    const registerOperation = this.repository.create(media);
    const mediaRegistered = await this.repository.save(registerOperation);
    return mediaRegistered;
  }

  async getMediaById(uuid: string): Promise<MediaEntity> {
    const mediaFound = await this.repository.findOne(uuid, {
      relations: ['user'],
    });

    if (!mediaFound) {
      throw new CustomException('MediaNotFound');
    }

    return mediaFound;
  }

  async incrementMediaViewsById(uuid: string): Promise<void> {
    const updateResult = await this.repository.increment(
      { id: uuid },
      'views',
      1,
    );

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('MediaNotFound');
    }

    return;
  }

  async deleteMediaById(uuid: string, user: User): Promise<void> {
    const deleteResult = await this.repository.delete({ id: uuid, user }); // using user as criteria to allow only the owner

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('MediaNotFound');
    }

    return;
  }

  async modifyMediaById(
    id: string,
    user: User,
    media: IParamsRepositoryModifyMedia,
  ): Promise<void> {
    const criteria = { id, user };
    const updateResult = await this.repository.update(criteria, media);

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('MediaNotFound');
    }

    return;
  }

  async searchMedia(
    searchFilters: IParamsRepositorySearchMedia,
  ): Promise<MediaEntity[]> {
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
    } = searchFilters;

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
}
