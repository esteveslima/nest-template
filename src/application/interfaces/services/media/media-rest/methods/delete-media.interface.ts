import { Media } from 'src/domain/entities/media';

export type IMediaRestServiceDeleteMediaParams = Pick<Media, 'id' | 'user'>;

export type IMediaRestServiceDeleteMediaResult = void;
