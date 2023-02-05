// Interface for repository method
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from '../../../entities/media';

export interface IMediaGatewayModifyMediaParams {
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
