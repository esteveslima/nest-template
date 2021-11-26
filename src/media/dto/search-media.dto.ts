// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'; // validation tools https://github.com/typestack/class-validator

import { MediaEntity } from '../media.entity';

// Create DTO with Entity format, which contains all the typeORM validations and Pipe validations
// exclude selected fields to match the current operation

// DTO with some entity fields to serve as filter for the search operation, marking them as optional to allow partial inputs for only specified filters
export class SearchMediaDTO extends PartialType(
  OmitType(MediaEntity, [
    'id',
    'updatedAt',
    'createdAt',
    'contentBase64',
  ] as const),
) {
  // Redefining entity property for this filter DTO
  @Type(() => Number) // Input modified to accept timestamps
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  createdAt: number;

  // extra properties for pagination, which doesnt belong to the entity
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
