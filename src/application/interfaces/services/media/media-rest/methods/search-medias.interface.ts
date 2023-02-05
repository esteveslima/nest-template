import { Media } from 'src/domain/entities/media';

export type IMediaRestServiceSearchMediasParams = Partial<
  Pick<
    Media,
    'title' | 'type' | 'description' | 'durationSeconds' | 'views' | 'available'
  >
> & {
  username?: Media['user']['username'];
  createdAt?: number;
  take?: number;
  skip?: number;
};

type IMediaRestServiceSearchMediasResultItem = Pick<
  Media,
  | 'id'
  | 'createdAt'
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'views'
  | 'available'
> & {
  username: Media['user']['username'];
};

export type IMediaRestServiceSearchMediasResult =
  IMediaRestServiceSearchMediasResultItem[];
