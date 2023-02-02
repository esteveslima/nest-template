// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceDeleteMediaParams } from 'src/modules/apps/media/application/interfaces/services/media-graphql/methods/delete-media.interface';
import { MediaBaseArgs } from './base/media-base.args';

type IDeleteMedia = Pick<IMediaGraphqlServiceDeleteMediaParams, 'id'>;

@ArgsType()
export class DeleteMediaArgsDTO
  extends PickType(MediaBaseArgs, ['id'] as const)
  implements IDeleteMedia {}
