import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaRestServiceGetMediaParams = Pick<Media, 'id'>;

export type IMediaRestServiceGetMediaResult = Pick<
  Media,
  | 'createdAt'
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
  | 'views'
  | 'available'
> & {
  owner: string;
};
