import {
  IMediaEventPublisherGatewayPublishMediaViewedParams,
  IMediaEventPublisherGatewayPublishMediaViewedResult,
} from './methods/publish-media-viewed.interface';

// pubsub events only concern the application, so its interface is defined here

export abstract class IMediaEventPublisherGateway {
  publishMediaViewed: (
    params: IMediaEventPublisherGatewayPublishMediaViewedParams,
  ) => Promise<IMediaEventPublisherGatewayPublishMediaViewedResult>;
}
