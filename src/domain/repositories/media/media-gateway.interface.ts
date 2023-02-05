import { Media } from '../../entities/media';
import { IMediaGatewayDeleteMediaParams } from './methods/delete-media.interface';
import { IMediaGatewayGetMediaParams } from './methods/get-media.interface';
import { IMediaGatewayIncrementMediaViewsParams } from './methods/increment-media-views.interface';
import { IMediaGatewayModifyMediaParams } from './methods/modify-media.interface';
import { IMediaGatewayRegisterMediaParams } from './methods/register-media.interface';
import { IMediaGatewaySearchMediasParams } from './methods/search-media.interface';

export abstract class IMediaGateway {
  registerMedia: (params: IMediaGatewayRegisterMediaParams) => Promise<Media>;
  getMedia: (params: IMediaGatewayGetMediaParams) => Promise<Media>;
  searchMedias: (params: IMediaGatewaySearchMediasParams) => Promise<Media[]>;
  modifyMedia: (params: IMediaGatewayModifyMediaParams) => Promise<void>;
  incrementMediaViews: (
    params: IMediaGatewayIncrementMediaViewsParams,
  ) => Promise<void>;
  deleteMedia: (params: IMediaGatewayDeleteMediaParams) => Promise<void>;
}
