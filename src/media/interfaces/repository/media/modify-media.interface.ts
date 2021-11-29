// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from 'src/media/media.entity';

export type IParamsRepositoryModifyMedia = Partial<
  Omit<MediaEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>
>;
