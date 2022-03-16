import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MediaEventsPubsubHandlerService } from '../../../domain/events/pubsub/media-events-pubsub-handler.service';
import { enumMediaPubsubPredefinedEvents } from '../enum-media-pubsub-predefined-events';

@Injectable()
export class MediaPubsubSubscriberService {
  // Get services and repositories from DI
  constructor(
    private mediaEventsPubsubHandlerService: MediaEventsPubsubHandlerService,
  ) {}

  // Subscribers listerners for asyncronous pubsub events

  @OnEvent(enumMediaPubsubPredefinedEvents.MEDIA_VIEWED, { async: true })
  async subscriberEventMediaViewed(
    payload: Parameters<
      typeof MediaEventsPubsubHandlerService.prototype.pubsubHandlerEventMediaViewed
    >[0],
  ): Promise<void> {
    await this.mediaEventsPubsubHandlerService.pubsubHandlerEventMediaViewed(
      payload,
    );

    return;
  }
}
