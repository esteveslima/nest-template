// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { MediaEntity } from '../../media.entity';

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

// DTO to insert new objects
export class RegisterMediaReqDTO extends OmitType(MediaEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'user',
  'views',
  'available',
] as const) {}
