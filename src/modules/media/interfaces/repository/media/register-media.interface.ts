// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { IMedia } from '../../entity/media.interface';

export type IParamsRepositoryRegisterMedia = Pick<
  IMedia,
  | 'user'
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
>;
