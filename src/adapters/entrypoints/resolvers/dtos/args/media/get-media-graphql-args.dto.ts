// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceGetMediaParams } from 'src/application/interfaces/services/media/media-graphql/methods/get-media.interface';
import { MediaBaseGraphqlArgsDTO } from './base/media-base-graphql-args.dto';

@ArgsType()
export class GetMediaGraphqlArgsDTO
  extends PickType(MediaBaseGraphqlArgsDTO, ['id'] as const)
  implements IMediaGraphqlServiceGetMediaParams {}
