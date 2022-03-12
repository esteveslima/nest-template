// Interface describing entity properties

import { IMedia } from '../../../../media/interfaces/models/entities/media.interface';

export enum enumGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum enumRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  // Auto generated fields

  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  medias: IMedia[];

  // Editable fields

  username: string;

  password: string;

  email: string;

  role: enumRole;

  gender: enumGenderType;

  age: number;
}
