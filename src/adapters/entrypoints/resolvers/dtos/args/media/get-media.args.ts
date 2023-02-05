// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceGetMediaParams } from 'src/application/interfaces/services/media/media-graphql/methods/get-media.interface';
import { MediaBaseArgs } from './base/media-base.args';

@ArgsType()
export class GetMediaArgsDTO
  extends PickType(MediaBaseArgs, ['id'] as const)
  implements IMediaGraphqlServiceGetMediaParams {}
