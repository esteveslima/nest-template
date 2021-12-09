// Base DTO, which can be reused and extended
// May contain data transformation for response

import { Expose, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IUser } from '../../../user/interfaces/entity/user.interface';
import { enumMediaType, IMedia } from '../../interfaces/entity/media.interface';

export class MediaResDTO implements IMedia {
  // Auto generated fields

  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relational fields

  @Expose()
  user: IUser;

  // Entity fields

  @Expose()
  title: string;

  @Expose()
  type: enumMediaType;

  @Expose()
  description: string;

  @Expose()
  durationSeconds: number;

  @Expose()
  contentBase64: string;

  @Expose()
  views: number;

  @Expose()
  available: boolean;
}
