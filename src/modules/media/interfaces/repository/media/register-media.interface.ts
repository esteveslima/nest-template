// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from '../../../media.entity';

export type IParamsRepositoryRegisterMedia = Omit<
  MediaEntity,
  'id' | 'createdAt' | 'updatedAt' | 'views' | 'available'
>;
