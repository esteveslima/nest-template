import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MediaHandlerService } from '../../../application/handlers/media-handler.service';
import { MediaViewedPayloadDTO } from './dtos/payload/media-viewed-payload.dto';
import { MEDIA_SUBSCRIBE_EVENTS } from './events/constants';

@Injectable()
export class MediaEventSubscriberEntrypoint {
  // Get services and repositories from DI
  constructor(private mediaHandlerService: MediaHandlerService) {}

  // Subscribers listeners for asynchronous pubsub events

  @OnEvent(MEDIA_SUBSCRIBE_EVENTS.media.events.MEDIA_VIEWED, {
    async: true,
  })
  async subscriberEventMediaViewed(
    params: MediaViewedPayloadDTO,
  ): Promise<void> {
    const { id } = params;

    await this.mediaHandlerService.handleEventMediaViewed({ id });

    return;
  }
}
