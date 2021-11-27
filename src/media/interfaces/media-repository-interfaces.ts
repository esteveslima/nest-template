import { MediaEntity } from '../media.entity';

// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

// Params

export type IParamsRepositoryRegisterMedia = Omit<
  MediaEntity,
  'id' | 'createdAt' | 'updatedAt' | 'views' | 'available'
>;

export type IParamsRepositoryModifyMedia = Partial<
  Omit<MediaEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>
>;

export interface IParamsRepositorySearchMedia
  extends Partial<Omit<MediaEntity, 'id' | 'updatedAt' | 'contentBase64'>> {
  take?: number;
  skip?: number;
}

// Result
