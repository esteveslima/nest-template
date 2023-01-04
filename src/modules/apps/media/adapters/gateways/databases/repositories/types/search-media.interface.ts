// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from 'src/modules/apps/media/domain/media.interface';

export interface IParamsRepositorySearchMedia
  extends Partial<
    Pick<
      Media,
      | 'createdAt'
      | 'title'
      | 'type'
      | 'description'
      | 'durationSeconds'
      | 'views'
      | 'available'
    >
  > {
  username?: string;
  take?: number;
  skip?: number;
}
