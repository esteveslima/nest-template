import {
  IMediaGraphqlServiceDeleteMediaParams,
  IMediaGraphqlServiceDeleteMediaResult,
} from './methods/delete-media.interface';
import {
  IMediaGraphqlServiceGetMediaParams,
  IMediaGraphqlServiceGetMediaResult,
} from './methods/get-media.interface';
import {
  IMediaGraphqlServiceModifyMediaParams,
  IMediaGraphqlServiceModifyMediaResult,
} from './methods/modify-media.interface';
import {
  IMediaGraphqlServiceRegisterMediaParams,
  IMediaGraphqlServiceRegisterMediaResult,
} from './methods/register-media.interface';
import {
  IMediaGraphqlServiceSearchMediasParams,
  IMediaGraphqlServiceSearchMediasResult,
} from './methods/search-medias.interface';

export abstract class IMediaGraphqlService {
  registerMedia: (
    params: IMediaGraphqlServiceRegisterMediaParams,
  ) => Promise<IMediaGraphqlServiceRegisterMediaResult>;
  getMedia: (
    params: IMediaGraphqlServiceGetMediaParams,
  ) => Promise<IMediaGraphqlServiceGetMediaResult>;

  searchMedias: (
    params: IMediaGraphqlServiceSearchMediasParams,
  ) => Promise<IMediaGraphqlServiceSearchMediasResult>;

  modifyMedia: (
    params: IMediaGraphqlServiceModifyMediaParams,
  ) => Promise<IMediaGraphqlServiceModifyMediaResult>;
  deleteMedia: (
    params: IMediaGraphqlServiceDeleteMediaParams,
  ) => Promise<IMediaGraphqlServiceDeleteMediaResult>;
}
