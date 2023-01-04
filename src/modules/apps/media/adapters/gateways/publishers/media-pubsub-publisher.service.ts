import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MediaPubsubSubscriberService } from '../../ports/subscribers/media-pubsub-subscriber.service';
import { PUBSUB_PUBLISH_EVENTS_MEDIA } from './events/constants';

@Injectable()
export class MediaPubsubPublisherService {
  // Get services and repositories from DI
  constructor(private eventEmitter: EventEmitter2) {}

  // Publisher of asyncronous pubsub events

  async publishMediaViewed(
    params: Parameters<
      typeof MediaPubsubSubscriberService.prototype.subscriberEventMediaViewed
    >[0],
  ): Promise<void> {
    await this.eventEmitter.emitAsync(
      PUBSUB_PUBLISH_EVENTS_MEDIA.media.events.MEDIA_VIEWED,
      params,
    );

    return;
  }

  // // method to publish predefined events with defined payloads
  // async publishEvent<
  //   T extends keyof IPubsubPredefinedEventsPayloads, // <- T points to a key
  //   R extends IPubsubPredefinedEventsPayloads[T], // <- R points to the type of that key
  // >(event: T, payload: R): Promise<void> {
  //   await this.eventEmitter.emitAsync(event, payload);

  //   return;
  // }

  // // method to publish any event string with any payload
  // async publishOpenEvent(
  //   event: string,
  //   payload: Record<string, any>,
  // ): Promise<void> {
  //   await this.eventEmitter.emitAsync(event, payload);

  //   return;
  // }
}
