import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MediaPubsubSubscriberService } from '../subscribers/media-pubsub-subscriber.service';

// Interface that maps each predefined event with it's correpondent required subscriber payload
interface IPubsubPredefinedEventsPayloads {
  MEDIA_VIEWED: Parameters<
    typeof MediaPubsubSubscriberService.prototype.subscriberEventMediaViewed
  >[0];
}

@Injectable()
export class MediaPubsubPublisherService {
  // Get services and repositories from DI
  constructor(private eventEmitter: EventEmitter2) {}

  // Publisher of asyncronous pubsub events

  // method to publish predefined events with defined payloads
  async publishEvent<
    T extends keyof IPubsubPredefinedEventsPayloads, // <- T points to a key
    R extends IPubsubPredefinedEventsPayloads[T], // <- R points to the type of that key
  >(event: T, payload: R): Promise<void> {
    try {
      await this.eventEmitter.emitAsync(event, payload);

      return;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }
  }

  // method to publish any event string with any payload
  async publishOpenEvent(
    event: string,
    payload: Record<string, any>,
  ): Promise<void> {
    try {
      await this.eventEmitter.emitAsync(event, payload);

      return;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }
  }

  // TODO: one publisher per event with fixed interfaces for payloads instead of generic methods?
}
