// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType, PartialType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { Media } from '../media.entity';

// Create DTO with Entity format, which contains all the typeORM validations and Pipe validations
// exclude selected fields to match the current operation

// similar to UpdateMediaDTO, but marking them as optional to allow partial input with only specific fields
export class PatchMediaDTO extends PartialType(
  OmitType(Media, ['id', 'createdAt', 'updatedAt', 'views'] as const),
) {}
