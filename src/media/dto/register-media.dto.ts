// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { Media } from '../media.entity';

// Create DTO with Entity format, except selected fields
export class RegisterMediaDTO extends OmitType(Media, [
  'id',
  'createdAt',
  'updatedAt',
  'views',
] as const) {}
