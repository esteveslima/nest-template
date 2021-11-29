// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { MediaEntity } from '../media.entity';

// Create DTO with Entity format, which contains all the typeORM validations and Pipe validations
// exclude selected fields to match the current operation

// DTO to modify the entire object, thus it may be very similar to to the RegisterMediaDTO
export class UpdateMediaDTO extends OmitType(MediaEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'user',
  'views',
  'available',
] as const) {}
