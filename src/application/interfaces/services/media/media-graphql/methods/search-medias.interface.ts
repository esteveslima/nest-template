import { Media } from 'src/domain/entities/media';

export type IMediaGraphqlServiceSearchMediasParams = Partial<
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

export type IMediaGraphqlServiceSearchMediasResult = Media[];
