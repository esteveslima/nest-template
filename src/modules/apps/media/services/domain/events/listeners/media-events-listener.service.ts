import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IEventMediaViewed } from '../../../../interfaces/services/domain/events/listeners/media-viewed.interface';
import { MediaRepository } from '../../../database/repositories/media.repository';
import { MEDIA_VIEWED } from './constants';

@Injectable()
export class MediaEventsListenerService {
  // Get services and repositories from DI
  constructor(private mediaRepository: MediaRepository) {}

  // Asyncronous listeners handlers for events

  @OnEvent(MEDIA_VIEWED, { async: true })
  private async mediaViewed(payload: IEventMediaViewed): Promise<void> {
    const isIncremented = await this.mediaRepository.incrementMediaViewsById(
      payload.uuid,
    );
    if (!isIncremented)
      throw new NotFoundException(
        `Media ${payload.uuid} not found for update on view count`,
      );
  }
}
