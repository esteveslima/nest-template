import { Injectable } from '@nestjs/common';
import { IMediaHandlerService } from 'src/application/interfaces/services/media/media-handler/media-handler.interface';
import {
  IMediaHandlerHandleEventMediaViewedParams,
  IMediaHandlerHandleEventMediaViewedResult,
} from 'src/application/interfaces/services/media/media-handler/methods/handle-event-media-viewed.interface';
import { IMediaGateway } from '../../../domain/repositories/media/media-gateway.interface';

@Injectable()
export class MediaHandlerService implements IMediaHandlerService {
  // Get services and repositories from DI
  constructor(private mediaGateway: IMediaGateway) {}

  // Handlers for listeners from asyncronous events

  async handleEventMediaViewed(
    params: IMediaHandlerHandleEventMediaViewedParams,
  ): Promise<IMediaHandlerHandleEventMediaViewedResult> {
    const { id } = params;

    await this.mediaGateway.incrementMediaViews({ id });

    return;
  }
}
