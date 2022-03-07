// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { MediaEntityBaseArgs } from './base/media-entity-base.args';

@ArgsType()
export class UpdateMediaArgs extends PartialType(
  PickType(MediaEntityBaseArgs, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
    'available',
  ] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
