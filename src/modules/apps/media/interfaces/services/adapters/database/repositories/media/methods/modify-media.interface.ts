// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { IMedia } from '../../../../../../models/entities/media.interface';

export type IParamsRepositoryModifyMedia = Partial<
  Pick<
    IMedia,
    | 'title'
    | 'type'
    | 'description'
    | 'durationSeconds'
    | 'contentBase64'
    | 'available'
  >
>;
