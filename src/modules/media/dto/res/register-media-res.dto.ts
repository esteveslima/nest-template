// Object encapsulating data required for a operation response

import { OmitType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { MediaEntity } from '../../media.entity';

// Create DTO with Entity format, requires the Expose decorator to keep the property across the serialization
// May modify or omit certain properties to match the operation

export class RegisterMediaResDTO extends OmitType(MediaEntity, [
  'createdAt',
  'updatedAt',
  'contentBase64',
  'views',
  'available',
  'user',
] as const) {}
