import { Media } from 'src/domain/entities/media';

export type IMediaGraphqlServiceDeleteMediaParams = Pick<Media, 'id' | 'user'>;

export type IMediaGraphqlServiceDeleteMediaResult = void;
