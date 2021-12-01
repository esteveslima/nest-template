// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
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

    await this.mediaRepository.incrementMediaViewsById(mediaUuid);

    return { ...mediaFound, owner: mediaFound.user.username };
  }

  async deleteMediaById(mediaUuid: string, user: UserEntity): Promise<void> {
    await this.mediaRepository.deleteMediaById(mediaUuid, user);

    return;
  }

  async modifyMediaById(
    mediaUuid: string,
    modifyMedia: UpdateMediaReqDTO | PatchMediaReqDTO,
    user: UserEntity,
  ): Promise<void> {
    await this.mediaRepository.modifyMediaById(mediaUuid, {
      ...modifyMedia,
      user,
    });

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

    const result = searchResult.map((media) => ({
      ...media,
      owner: media.user.username,
    }));

    return result;
  }
}
