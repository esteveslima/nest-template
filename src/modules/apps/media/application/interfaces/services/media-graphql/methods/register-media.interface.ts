import { Media } from 'src/modules/apps/media/domain/entities/media';

export type IMediaGraphqlServiceRegisterMediaParams = Pick<
  Media,
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
  | 'user'
>;

export type IMediaGraphqlServiceRegisterMediaResult = Media;
