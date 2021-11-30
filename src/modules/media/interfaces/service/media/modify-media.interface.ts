// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from '../../../media.entity';

export type IParamsServiceModifyMedia = Partial<
  Omit<MediaEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>
>;
