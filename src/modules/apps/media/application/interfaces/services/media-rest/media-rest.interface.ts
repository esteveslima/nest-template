import {
  IMediaRestServiceDeleteMediaParams,
  IMediaRestServiceDeleteMediaResult,
} from './methods/delete-media.interface';
import {
  IMediaRestServiceGetMediaParams,
  IMediaRestServiceGetMediaResult,
} from './methods/get-media.interface';
import {
  IMediaRestServiceModifyMediaParams,
  IMediaRestServiceModifyMediaResult,
} from './methods/modify-media.interface';
import { IMediaRestServiceRegisterMediaResult } from './methods/register-media.interface';
import { IMediaRestServiceRegisterMediaParams } from './methods/register-media.interface';
import {
  IMediaRestServiceSearchMediasParams,
  IMediaRestServiceSearchMediasResult,
} from './methods/search-medias.interface';

export abstract class IMediaRestService {
  registerMedia: (
    params: IMediaRestServiceRegisterMediaParams,
  ) => Promise<IMediaRestServiceRegisterMediaResult>;
  getMedia: (
    params: IMediaRestServiceGetMediaParams,
  ) => Promise<IMediaRestServiceGetMediaResult>;
  searchMedias: (
    params: IMediaRestServiceSearchMediasParams,
  ) => Promise<IMediaRestServiceSearchMediasResult>;
  modifyMedia: (
    params: IMediaRestServiceModifyMediaParams,
  ) => Promise<IMediaRestServiceModifyMediaResult>;
  deleteMedia: (
    params: IMediaRestServiceDeleteMediaParams,
  ) => Promise<IMediaRestServiceDeleteMediaResult>;
}
