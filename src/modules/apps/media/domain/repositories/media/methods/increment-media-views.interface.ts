// Interface for repository method
// May extend Entity and modify or omit certain properties to match the operation

import { Media } from '../../../entities/media';

export type IMediaGatewayIncrementMediaViewsParams = Pick<Media, 'id'>;
