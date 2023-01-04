import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MediaEventsHandlerService } from '../../../application/handlers/media-events-handler.service';
import { PUBSUB_SUBSCRIBE_EVENTS_MEDIA } from './events/constants';

@Injectable()
export class MediaPubsubSubscriberService {
  // Get services and repositories from DI
  constructor(
    private mediaEventsPubsubHandlerService: MediaEventsHandlerService,
  ) {}

  // Subscribers listeners for asynchronous pubsub events

  @OnEvent(PUBSUB_SUBSCRIBE_EVENTS_MEDIA.media.events.MEDIA_VIEWED, {
    async: true,
  })
  async subscriberEventMediaViewed(
    payload: Parameters<
      typeof MediaEventsHandlerService.prototype.handleEventMediaViewed
    >[0],
  ): Promise<void> {
    await this.mediaEventsPubsubHandlerService.handleEventMediaViewed(payload);

    return;
  }
}
