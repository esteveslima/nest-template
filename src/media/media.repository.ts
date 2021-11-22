// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SearchMediaDTO } from './dto/search-media.dto';
import { PatchMediaDTO } from './dto/patch-media.dto';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { UpdateMediaDTO } from './dto/update-media.dto';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRespository extends Repository<Media> {
  // TODO: add field select, search filters and query builders to improve database operations

  async registerMedia(registerMediaDTO: RegisterMediaDTO): Promise<Media> {
    const registerOperation = this.create({
      ...registerMediaDTO,
      // views: 0,          // disabled because now using entity default values
      // available: true,   // disabled because now using entity default values
    });
    const mediaRegistered = await this.save(registerOperation);

    return mediaRegistered;
  }

  async getMediaById(uuid: string): Promise<Media> {
    const mediaFound = await this.findOne(uuid);

    if (!mediaFound) throw new NotFoundException();

    return mediaFound;
  }

  async deleteMediaById(uuid: string): Promise<void> {
    const deleteResult = await this.delete(uuid);

    if (deleteResult.affected <= 0) throw new NotFoundException();

    return;
  }

  async modifyMediaById(
    uuid: string,
    modifyMediaDTO: UpdateMediaDTO | PatchMediaDTO,
  ): Promise<void> {
    const mediaModified = await this.update(uuid, { ...modifyMediaDTO });

    if (mediaModified.affected <= 0) throw new NotFoundException();

    return;
  }

  async searchMedia(searchMediaDTO: SearchMediaDTO): Promise<Media[]> {
    const {
      available,
      createdAt,
      description,
      durationSeconds,
      title,
      type,
      views,
      take,
      skip,
    } = searchMediaDTO;

    const query = this.createQueryBuilder('media');

    if (available) {
      // add condition to filter for avilability status
      query.andWhere('media.available = :available', { available });
    }
    if (createdAt) {
      // add condition to filter for min creation date
      query.andWhere('media.createdAt >= :createdAt', { createdAt });
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
