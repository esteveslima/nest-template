// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { MediaEntityBaseArgs } from './base/media-entity-base.args';

@ArgsType()
export class RegisterMediaArgsDTO extends PickType(MediaEntityBaseArgs, [
  'title',
  'type',
  'description',
  'durationSeconds',
  'contentBase64',
] as const) {}
