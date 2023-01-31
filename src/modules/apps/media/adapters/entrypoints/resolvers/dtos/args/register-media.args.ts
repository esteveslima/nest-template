// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { MediaGraphqlValidationArgs } from '../base/media-graphql-validation.args';

@ArgsType()
export class RegisterMediaArgsDTO extends PickType(MediaGraphqlValidationArgs, [
  'title',
  'type',
  'description',
  'durationSeconds',
  'contentBase64',
] as const) {}
