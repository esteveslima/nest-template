// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { MediaRestValidationDTO } from '../base/media-rest-validation.dto';

// search filters
export class SearchMediaReqDTO extends PartialType(
  PickType(MediaRestValidationDTO, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'views',
    'available',
  ] as const),
) {
  // Redefining base dto properties for this filter DTO
  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  createdAt?: number; // Input modified to accept timestamps

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string; // Input modified to accept user username

  // extra properties for pagination, which doesnt belong to the base dto
  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  take: number;

  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  skip: number;
}
