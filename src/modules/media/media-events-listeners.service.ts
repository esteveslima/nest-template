import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { IEventMediaViewed } from './interfaces/events/media-viewed.interface';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaEventsListenersService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(MediaRepository)
    private mediaRepository: MediaRepository,
  ) {}

  // Asyncronous listeners handlers for events

  @OnEvent('media.viewed', { async: true })
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
