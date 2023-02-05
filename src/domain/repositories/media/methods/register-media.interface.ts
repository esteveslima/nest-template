// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from '../../../entities/media';

export type IMediaGatewayRegisterMediaParams = Pick<
  Media,
  | 'user'
  | 'title'
  | 'type'
  | 'description'
  | 'durationSeconds'
  | 'contentBase64'
>;
