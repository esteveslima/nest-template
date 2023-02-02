import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaGraphqlServiceGetMediaParams = Pick<Media, 'id'>;

export type IMediaGraphqlServiceGetMediaResult = Media;
