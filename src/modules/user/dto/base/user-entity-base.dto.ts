// Base entity reference DTO
// May be often used as a simple interface to allow swagger build documentation

import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMedia } from '../../../media/interfaces/entity/media.interface';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../../interfaces/entity/user.interface';

export class UserEntityBaseDTO implements IUser {
  // Auto generated fields

  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Relational fields

  medias: IMedia[];

  // Entity fields

  username: string;
  password: string;
  email: string;
  role: enumRole;
  gender: enumGenderType;
  age: number;
}
