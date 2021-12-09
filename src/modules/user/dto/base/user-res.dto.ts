// Base DTO, which can be reused and extended
// May contain data transformation for response

import { Expose, Transform } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IMedia } from '../../../media/interfaces/entity/media.interface';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../../interfaces/entity/user.interface';

export class UserResDTO implements IUser {
  // Auto generated fields

  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relational fields

  @Expose()
  medias: IMedia[];

  // Entity fields

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  email: string;

  @Expose()
  role: enumRole;

  @Expose()
  gender: enumGenderType;

  @Expose()
  age: number;
}
