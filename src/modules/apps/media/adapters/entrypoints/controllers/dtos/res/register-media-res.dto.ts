// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import { Media } from 'src/modules/apps/media/domain/entities/media';

export class RegisterMediaResDTO extends PickType(Media, [
  'id',
  'title',
  'type',
  'description',
  'durationSeconds',
] as const) {}
