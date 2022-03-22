import { Injectable } from '@nestjs/common';
import { IPubsubEventMediaViewedPayload } from '../../../../interfaces/services/domain/events/pubsub/media-viewed-payload.interface';
import { MediaRepository } from '../../../adapters/database/repositories/media.repository';

@Injectable()
export class MediaEventsPubsubHandlerService {
  // Get services and repositories from DI
  constructor(private mediaRepository: MediaRepository) {}

  // Handlers for listeners from asyncronous events

  async pubsubHandlerEventMediaViewed(
    payload: IPubsubEventMediaViewedPayload,
  ): Promise<void> {
    await this.mediaRepository.incrementMediaViewsById(payload.uuid);
  }
}
