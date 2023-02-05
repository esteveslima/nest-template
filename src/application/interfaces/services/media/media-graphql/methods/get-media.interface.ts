import { Media } from 'src/domain/entities/media';

export type IMediaGraphqlServiceGetMediaParams = Pick<Media, 'id'>;

export type IMediaGraphqlServiceGetMediaResult = Media;
