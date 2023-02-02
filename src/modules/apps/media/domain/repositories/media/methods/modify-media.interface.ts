// Interface for repository method
// May extend Entity and modify or omit certain properties to match the operation

import { User } from 'src/modules/apps/user/domain/entities/user';
import { Media } from '../../../entities/media';

export interface IMediaGatewayModifyMediaParams {
  indexes: Pick<Media, 'id'> & { user: User };
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
