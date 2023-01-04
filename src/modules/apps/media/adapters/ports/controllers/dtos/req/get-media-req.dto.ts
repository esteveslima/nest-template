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

export class GetMediaReqDTO extends PartialType(
  PickType(MediaRestValidationDTO, ['id'] as const),
) {}
