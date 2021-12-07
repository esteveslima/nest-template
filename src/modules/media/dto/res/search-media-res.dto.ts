// Object encapsulating data required for an operation response
// Extends base DTO, which already contains pipe validations and transformation decorators(requires the Expose decorator to keep the property across the response serialization)

import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { MediaDTO } from '../base/media.dto';

export class SearchMediaResDTO extends PickType(MediaDTO, [
  'id',
  'createdAt',
  'title',
  'type',
  'description',
  'durationSeconds',
  'views',
  'available',
] as const) {
  @Expose()
  owner: string;
}
