// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { Media } from '../media.entity';

// Create DTO with Entity format, which contains all the typeORM validations and Pipe validations
// exclude selected fields to match the current operation

// DTO with some entity fields to serve as filter for the search operation, marking them as optional to allow partial inputs for certain filters
export class SearchMediaDTO extends PartialType(
  OmitType(Media, ['id', 'updatedAt', 'contentBase64'] as const),
) {
  // extra fields for pagination, which doesnt belong to the entity
  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  take: number;

  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  skip: number;
}
