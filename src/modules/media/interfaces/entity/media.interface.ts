// Interface describing entity properties

import { IUser } from '../../../user/interfaces/entity/user.interface';

export enum enumMediaType {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  MOVIE = 'MOVIE',
  DOCUMENTARY = 'DOCUMENTARY',
  SHOW = 'SHOW',
  PODCAST = 'PODCAST',
  AUDIOBOOK = 'AUDIOBOOK',
}

export interface IMedia {
  // Auto generated fields
  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  user: IUser;

  // Editable fields

  title: string;

  type: enumMediaType;

  description: string;

  durationSeconds: number;

  contentBase64: string;

  views: number;

  available: boolean;
}
