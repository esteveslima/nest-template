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
import { IMediaRestServiceSearchMediasParams } from 'src/application/interfaces/services/media/media-rest/methods/search-medias.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

// search filters
export class SearchMediasRestRequestDTO
  extends PartialType(
    PickType(MediaValidatorDTO, [
      'title',
      'type',
      'description',
      'durationSeconds',
      'views',
      'available',
    ] as const),
  )
  implements IMediaRestServiceSearchMediasParams
{
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
  take?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  skip?: number;
}
