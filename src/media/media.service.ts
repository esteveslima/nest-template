// Responsible for containing business logic

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { Media } from './media.entity';
import { MediaRespository } from './media.repository';

@Injectable()
export class MediaService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRespository)
    private mediaRepository: MediaRespository,
  ) {}

  // Define methods containing business logic
  async registerMedia(registerMediaDTO: RegisterMediaDTO): Promise<Media> {
    return this.mediaRepository.registerMedia(registerMediaDTO);
  }
}
