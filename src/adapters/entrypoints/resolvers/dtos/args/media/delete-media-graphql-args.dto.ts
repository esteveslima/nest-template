// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceDeleteMediaParams } from 'src/application/interfaces/services/media/media-graphql/methods/delete-media.interface';
import { MediaBaseGraphqlArgsDTO } from './base/media-base-graphql-args.dto';

type IDeleteMedia = Pick<IMediaGraphqlServiceDeleteMediaParams, 'id'>;

@ArgsType()
export class DeleteMediaGraphqlArgsDTO
  extends PickType(MediaBaseGraphqlArgsDTO, ['id'] as const)
  implements IDeleteMedia {}
