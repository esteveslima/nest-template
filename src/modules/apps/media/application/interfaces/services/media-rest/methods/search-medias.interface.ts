import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaRestServiceSearchMediasParams = Partial<
  Pick<
    Media,
    'title' | 'type' | 'description' | 'durationSeconds' | 'views' | 'available'
  >
> & {
  createdAt?: number;
  username?: string;
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
  username: string;
};

export type IMediaRestServiceSearchMediasResult =
  IMediaRestServiceSearchMediasResultItem[];
