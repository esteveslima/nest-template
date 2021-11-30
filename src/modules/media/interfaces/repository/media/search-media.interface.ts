// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from '../../../media.entity';

export interface IParamsRepositorySearchMedia
  extends Partial<
    Omit<MediaEntity, 'id' | 'updatedAt' | 'contentBase64' | 'user'>
  > {
  owner?: string;
  take?: number;
  skip?: number;
}
