// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { MediaReqDTO } from '../base/media-req.dto';

export class RegisterMediaReqDTO extends PickType(MediaReqDTO, [
  'title',
  'type',
  'description',
  'durationSeconds',
  'contentBase64',
] as const) {}
