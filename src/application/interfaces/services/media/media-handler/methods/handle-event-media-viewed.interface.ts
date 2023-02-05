import { Media } from 'src/domain/entities/media';

export type IMediaHandlerHandleEventMediaViewedParams = Pick<Media, 'id'>;

export type IMediaHandlerHandleEventMediaViewedResult = void;
