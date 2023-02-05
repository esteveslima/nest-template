import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaGraphqlServiceDeleteMediaParams = Pick<Media, 'id' | 'user'>;

export type IMediaGraphqlServiceDeleteMediaResult = void;
