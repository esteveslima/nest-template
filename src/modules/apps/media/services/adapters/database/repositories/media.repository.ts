// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MediaEntity } from '../../../../models/media.entity';
import { IParamsRepositoryModifyMedia } from '../../../../interfaces/services/adapters/database/repositories/media/methods/modify-media.interface';
import { IUser } from '../../../../../user/interfaces/models/entities/user-entity.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { IParamsRepositoryRegisterMedia } from '../../../../interfaces/services/adapters/database/repositories/media/methods/register-media.interface';
import { IParamsRepositorySearchMedia } from '../../../../interfaces/services/adapters/database/repositories/media/methods/search-media.interface';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectRepository(MediaEntity, SINGLE_DB)
    private repository: Repository<MediaEntity>,
  ) {}

  async registerMedia(
    media: IParamsRepositoryRegisterMedia,
  ): Promise<MediaEntity> {
    try {
      const registerOperation = this.repository.create(media);
      const mediaRegistered = await this.repository.save(registerOperation);
      return mediaRegistered;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }
  }

  async getMediaById(uuid: string): Promise<MediaEntity> {
    let mediaFound: MediaEntity;
    try {
      mediaFound = await this.repository.findOne(uuid, {
        relations: ['user'],
      });
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    if (!mediaFound) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }

    return mediaFound;
  }

  async incrementMediaViewsById(uuid: string): Promise<void> {
    let updateResult: UpdateResult;
    try {
      updateResult = await this.repository.increment({ id: uuid }, 'views', 1);
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }

    return;
  }

  async deleteMediaById(uuid: string, user: IUser): Promise<void> {
    let deleteResult: DeleteResult;
    try {
      deleteResult = await this.repository.delete({ id: uuid, user }); // using user as criteria to allow only the owner
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }

    return;
  }

  async modifyMediaById(
    id: string,
    user: IUser,
    media: IParamsRepositoryModifyMedia,
  ): Promise<void> {
    const criteria = { id, user };
    let updateResult: UpdateResult;
    try {
      updateResult = await this.repository.update(criteria, media);
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
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

    let searchResult: MediaEntity[];
    try {
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

      searchResult = await query.getMany();
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    return searchResult;
  }
}
