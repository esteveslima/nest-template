// Responsible for containing business logic

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRespository } from './media.repository';

import { UserEntity } from '../user/user.entity';
import { SearchMediaResDTO } from './dto/res/search-media-res.dto';
import { RegisterMediaResDTO } from './dto/res/register-media-res.dto';
import { GetMediaResDTO } from './dto/res/get-media-res.dto';
import { RegisterMediaReqDTO } from './dto/req/register-media-req.dto';
import { UpdateMediaReqDTO } from './dto/req/update-media-req.dto';
import { PatchMediaReqDTO } from './dto/req/patch-media-req.dto';
import { SearchMediaReqDTO } from './dto/req/search-media-req.dto';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRespository)
    private mediaRepository: MediaRespository,
  ) {}

  // Define methods containing business logic

  //TODO: plaintoclass/classtoplain to prune all parameters and results from all methods(?)
  async registerMedia(
    media: RegisterMediaReqDTO,
    user: UserEntity,
  ): Promise<RegisterMediaResDTO> {
    const mediaCreated = await this.mediaRepository.registerMedia({
      ...media,
      user,
    });

    return mediaCreated;
  }

  async getMediaById(mediaUuid: string): Promise<GetMediaResDTO> {
    const mediaFound = await this.mediaRepository.getMediaById(mediaUuid);
    if (!mediaFound) throw new NotFoundException();

    //TODO: use "pubsub decorator" to increment
    const isIncremented = await this.mediaRepository.incrementMediaViewsById(
      mediaUuid,
    );
    if (!isIncremented) throw new NotFoundException();

    return { ...mediaFound, owner: mediaFound.user.username };
  }

  async deleteMediaById(mediaUuid: string, user: UserEntity): Promise<void> {
    const isDeleted = await this.mediaRepository.deleteMediaById(
      mediaUuid,
      user,
    );
    if (!isDeleted) throw new NotFoundException();

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    user: UserEntity,
    modifyMedia: UpdateMediaReqDTO | PatchMediaReqDTO,
  ): Promise<void> {
    const isModified = await this.mediaRepository.modifyMediaById(
      mediaUuid,
      user,
      modifyMedia,
    );
    if (!isModified) throw new NotFoundException();

    return;
  }

  async searchMedia(
    searchMediaFilters: SearchMediaReqDTO,
  ): Promise<SearchMediaResDTO[]> {
    const searchFilters = {
      ...searchMediaFilters,
      createdAt: searchMediaFilters.createdAt
        ? new Date(searchMediaFilters.createdAt)
        : undefined,
    };
    const searchResult = await this.mediaRepository.searchMedia(searchFilters);
    if (searchResult.length <= 0) throw new NotFoundException();

    const result = searchResult.map((media) => ({
      ...media,
      owner: media.user.username,
    }));

    return result;
  }
}
