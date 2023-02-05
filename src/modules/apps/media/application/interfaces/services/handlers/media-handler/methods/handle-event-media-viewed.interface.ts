import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaHandlerHandleEventMediaViewedParams = Pick<Media, 'id'>;

export type IMediaHandlerHandleEventMediaViewedResult = void;
