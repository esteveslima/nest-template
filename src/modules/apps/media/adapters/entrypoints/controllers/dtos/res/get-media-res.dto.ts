// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { Media } from 'src/modules/apps/media/domain/media.interface';

export class GetMediaResDTO extends PickType(Media, [
  'createdAt',
  'title',
  'type',
  'description',
  'durationSeconds',
  'contentBase64',
  'views',
  'available',
] as const) {
  owner: string;
}
