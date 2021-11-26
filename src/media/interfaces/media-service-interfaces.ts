import { MediaEntity } from '../media.entity';

// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

// Params

export type IParamsServiceRegisterMedia = Omit<
  MediaEntity,
  'id' | 'createdAt' | 'updatedAt' | 'views' | 'available'
>;

export type IParamsServiceModifyMedia = Partial<
  Omit<MediaEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>
>;

export interface IParamsServiceSearchMedia
  extends Partial<
    Omit<MediaEntity, 'id' | 'updatedAt' | 'createdAt' | 'contentBase64'>
  > {
  createdAt: number;
  take: number;
  skip: number;
}

// Result

export type IResultServiceRegisterMedia = Omit<
  MediaEntity,
  'createdAt' | 'updatedAt' | 'contentBase64' | 'views' | 'available'
>;

export type IResultServiceGetMedia = Omit<MediaEntity, 'id' | 'updatedAt'>;

export type IResultServiceSearchMedia = Omit<
  MediaEntity,
  'updatedAt' | 'contentBase64'
>;
