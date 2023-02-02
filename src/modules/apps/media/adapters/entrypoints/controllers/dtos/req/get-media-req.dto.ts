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
import { IMediaRestServiceGetMediaParams } from 'src/modules/apps/media/application/interfaces/services/media-rest/methods/get-media.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

export class GetMediaReqDTO
  extends PickType(MediaValidatorDTO, ['id'] as const)
  implements IMediaRestServiceGetMediaParams {}
