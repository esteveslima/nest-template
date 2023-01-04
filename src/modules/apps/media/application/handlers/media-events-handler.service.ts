import { Injectable } from '@nestjs/common';
import { IHandleMediaViewedParams } from 'src/modules/apps/media/application/handlers/types/media-viewed.interface';
import { MediaRepository } from '../../adapters/gateways/databases/repositories/media.repository';

@Injectable()
export class MediaEventsHandlerService {
  // Get services and repositories from DI
  constructor(private mediaRepository: MediaRepository) {}

  // Handlers for listeners from asyncronous events

  async handleEventMediaViewed(
    payload: IHandleMediaViewedParams,
  ): Promise<void> {
    await this.mediaRepository.incrementMediaViewsById(payload.uuid);
  }
}
