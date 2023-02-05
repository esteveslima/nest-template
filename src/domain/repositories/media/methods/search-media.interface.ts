// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from '../../../entities/media';

export type IMediaGatewaySearchMediasParams = Partial<
  Pick<
    Media,
    | 'createdAt'
    | 'title'
    | 'type'
    | 'description'
    | 'durationSeconds'
    | 'views'
    | 'available'
  >
> & {
  username?: string;
  take?: number;
  skip?: number;
};
