// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { MediaEntity } from '../../../media.entity';

export interface IParamsServiceSearchMedia
  extends Partial<
    Omit<MediaEntity, 'id' | 'updatedAt' | 'createdAt' | 'contentBase64'>
  > {
  createdAt?: number;
  owner?: string;
  take?: number;
  skip?: number;
}

export interface IResultServiceSearchMedia
  extends Omit<MediaEntity, 'updatedAt' | 'contentBase64' | 'user'> {
  owner: string;
}
