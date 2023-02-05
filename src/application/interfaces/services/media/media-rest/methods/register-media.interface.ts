import { Media } from 'src/domain/entities/media';
export type IMediaRestServiceRegisterMediaParams = Pick<
  Media,
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
  | 'user'
>;

export type IMediaRestServiceRegisterMediaResult = Pick<
  Media,
  'id' | 'title' | 'type' | 'description' | 'durationSeconds'
>;
