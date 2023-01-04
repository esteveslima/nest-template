// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from 'src/modules/apps/media/domain/media.interface';

export type IParamsRepositoryRegisterMedia = Pick<
  Media,
  | 'user'
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
>;
