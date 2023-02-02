import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaRestServiceDeleteMediaParams = Pick<Media, 'id' | 'user'>;

export type IMediaRestServiceDeleteMediaResult = void;
