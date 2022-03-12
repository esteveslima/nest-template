// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { MediaEntityBaseDTO } from '../../base/media-entity-base.dto';

export class SearchMediaResDTO extends PickType(MediaEntityBaseDTO, [
  'id',
  'createdAt',
  'title',
  'type',
  'description',
  'durationSeconds',
  'views',
  'available',
] as const) {
  username: string;
}
