// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from 'src/media/media.entity';

export type IParamsServiceRegisterMedia = Omit<
  MediaEntity,
  'id' | 'createdAt' | 'updatedAt' | 'views' | 'available'
>;

export interface IResultServiceRegisterMedia
  extends Omit<
    MediaEntity,
    'createdAt' | 'updatedAt' | 'contentBase64' | 'views' | 'available' | 'user'
  > {
  owner: string;
}
