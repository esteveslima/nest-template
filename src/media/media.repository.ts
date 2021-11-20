// Responsible for data access logic in the database

import { EntityRepository, Repository } from 'typeorm';
import { RegisterMediaDTO } from './dto/register-media.dto';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRespository extends Repository<Media> {
  async registerMedia(registerMediaDTO: RegisterMediaDTO): Promise<Media> {
    const mediaRegistration = this.create({
      ...registerMediaDTO,
      views: 0,
    });
    const operationResult = await this.save(mediaRegistration);

    return operationResult;
  }
}
