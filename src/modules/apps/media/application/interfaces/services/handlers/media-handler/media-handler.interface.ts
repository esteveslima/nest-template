import {
  IMediaHandlerHandleEventMediaViewedParams,
  IMediaHandlerHandleEventMediaViewedResult,
} from './methods/handle-event-media-viewed.interface';

export abstract class IMediaHandlerService {
  handleEventMediaViewed: (
    params: IMediaHandlerHandleEventMediaViewedParams,
  ) => Promise<IMediaHandlerHandleEventMediaViewedResult>;
}
