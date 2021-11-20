// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
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
}
