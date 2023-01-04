// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from 'src/modules/apps/media/domain/media.interface';

export type IParamsRepositoryModifyMedia = Partial<
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
