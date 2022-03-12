// Base entity reference DTO
// May be often used as a simple interface to allow swagger build documentation

import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMedia } from '../../../media/interfaces/models/entities/media.interface';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../../interfaces/models/entities/user-entity.interface';

export class UserEntityBaseDTO implements IUser {
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
