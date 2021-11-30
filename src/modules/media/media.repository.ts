// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { IParamsRepositoryModifyMedia } from './interfaces/repository/media/modify-media.interface';
import { IParamsRepositoryRegisterMedia } from './interfaces/repository/media/register-media.interface';
import { IParamsRepositorySearchMedia } from './interfaces/repository/media/search-media.interface';
import { MediaEntity } from './media.entity';

@EntityRepository(MediaEntity)
export class MediaRespository extends Repository<MediaEntity> {
  async registerMedia(
    media: IParamsRepositoryRegisterMedia,
  ): Promise<MediaEntity> {
    const registerOperation = this.create(media);
    const mediaRegistered = await this.save(registerOperation);

    return mediaRegistered;
  }

  async getMediaById(uuid: string): Promise<MediaEntity> {
    const mediaFound = await this.findOne(uuid);

    if (!mediaFound) throw new NotFoundException();

    return mediaFound;
  }

  async incrementMediaViewsById(uuid: string): Promise<void> {
    const incrementResult = await this.increment({ id: uuid }, 'views', 1);

    if (incrementResult.affected <= 0) throw new NotFoundException();

    return;
  }

  async deleteMediaById(uuid: string, user: UserEntity): Promise<void> {
    const deleteResult = await this.delete({ id: uuid, user });

    if (deleteResult.affected <= 0) throw new NotFoundException();

    return;
  }

  async modifyMediaById(
    uuid: string,
    media: IParamsRepositoryModifyMedia,
  ): Promise<void> {
    const mediaModified = await this.update(
      { id: uuid, user: media.user },
      { ...media },
    );

    if (mediaModified.affected <= 0) throw new NotFoundException();

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
      owner,
      take,
      skip,
    } = searchFilters;

    const query = this.createQueryBuilder('media');

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

    if (owner) {
      // add condition to filter media owner username
      query.andWhere('user.username LIKE :username', {
        username: `%${owner}%`,
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
