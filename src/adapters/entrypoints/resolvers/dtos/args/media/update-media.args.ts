// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { IMediaGraphqlServiceModifyMediaParams } from 'src/application/interfaces/services/media/media-graphql/methods/modify-media.interface';
import { MediaBaseArgs } from './base/media-base.args';

type IUpdateMedia = IMediaGraphqlServiceModifyMediaParams['data'] &
  Pick<IMediaGraphqlServiceModifyMediaParams['indexes'], 'id'>;

@ArgsType()
export class UpdateMediaArgsDTO
  extends PartialType(
    PickType(MediaBaseArgs, [
      'title',
      'type',
      'description',
      'durationSeconds',
      'contentBase64',
      'available',
    ] as const),
  )
  implements IUpdateMedia
{
  @Field(() => ID)
  @IsUUID()
  id: string;
}
