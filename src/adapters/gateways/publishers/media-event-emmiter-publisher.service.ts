import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IMediaEventPublisherGateway } from 'src/application/interfaces/ports/media-event-publisher/media-event-publisher-gateway.interface';
import {
  IMediaEventPublisherGatewayPublishMediaViewedParams,
  IMediaEventPublisherGatewayPublishMediaViewedResult,
} from 'src/application/interfaces/ports/media-event-publisher/methods/publish-media-viewed.interface';
import { MEDIA_PUBLISH_EVENTS } from './events/constants';

// concrete implementation of the application event publisher dependency
// ideally this layer should also deppend on interfaces, but currently ignoring the dependency rule on this layer towards a more pragmatic approach

@Injectable()
export class MediaEventEmmiterPublisherGateway
  implements IMediaEventPublisherGateway
{
  // Get services and repositories from DI
  constructor(private eventEmitter: EventEmitter2) {}

  // Publisher of asyncronous pubsub events

  async publishMediaViewed(
    params: IMediaEventPublisherGatewayPublishMediaViewedParams,
  ): Promise<IMediaEventPublisherGatewayPublishMediaViewedResult> {
    const { id } = params;

    await this.eventEmitter.emitAsync(
      MEDIA_PUBLISH_EVENTS.media.events.MEDIA_VIEWED,
      { id },
    );

    return;
  }
}
