// Interface describing entity properties

import { Media } from './media';

export enum enumGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum enumRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  // Auto generated fields

  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  medias: Media[];

  // Editable fields

  username: string;

  password: string;

  email: string;

  role: enumRole;

  gender: enumGenderType;

  age: number;
}
