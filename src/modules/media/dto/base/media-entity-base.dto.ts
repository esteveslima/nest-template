// Base DTO, which can be reused and extended
// May contain data transformation for response

import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IUser } from '../../../user/interfaces/entity/user.interface';
import { enumMediaType, IMedia } from '../../interfaces/entity/media.interface';

export class MediaEntityBaseDTO implements IMedia {
  // Auto generated fields

  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Relational fields

  user: IUser;

  // Entity fields

  title: string;
  type: enumMediaType;
  description: string;
  durationSeconds: number;
  contentBase64: string;
  views: number;
  available: boolean;
}
