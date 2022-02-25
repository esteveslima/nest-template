// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import { MediaEntityBaseDTO } from '../base/media-entity-base.dto';

export class RegisterMediaResDTO extends PickType(MediaEntityBaseDTO, [
  'id',
  'title',
  'type',
  'description',
  'durationSeconds',
] as const) {}
