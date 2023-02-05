// Interface describing entity properties

import { User } from './user';

export enum enumMediaType {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  MOVIE = 'MOVIE',
  DOCUMENTARY = 'DOCUMENTARY',
  SHOW = 'SHOW',
  PODCAST = 'PODCAST',
  AUDIOBOOK = 'AUDIOBOOK',
}

export class Media {
  // Auto generated fields
  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  user: User;

  // Editable fields

  title: string;

  type: enumMediaType;

  description: string;

  durationSeconds: number;

  contentBase64: string;

  views: number;

  available: boolean;
}
