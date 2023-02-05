import { Media } from 'src/domain/entities/media';

export interface IMediaGraphqlServiceModifyMediaParams {
  indexes: Pick<Media, 'id' | 'user'>;
  data: Partial<
    Pick<
      Media,
      | 'title'
      | 'type'
      | 'description'
      | 'durationSeconds'
      | 'contentBase64'
      | 'available'
    >
  >;
}

export type IMediaGraphqlServiceModifyMediaResult = void;
