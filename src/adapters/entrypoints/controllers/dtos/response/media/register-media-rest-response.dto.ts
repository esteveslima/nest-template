// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import { MediaValidatorDTO } from '../../request/media/base/media-validator.dto';

export class RegisterMediaRestResponseDTO extends PickType(MediaValidatorDTO, [
  'id',
  'title',
  'type',
  'description',
  'durationSeconds',
] as const) {}
