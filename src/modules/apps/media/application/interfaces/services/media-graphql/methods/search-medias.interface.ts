import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaGraphqlServiceSearchMediasParams = Partial<
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

export type IMediaGraphqlServiceSearchMediasResult = Media[];
