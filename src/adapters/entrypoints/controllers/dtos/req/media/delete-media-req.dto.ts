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
import { IMediaRestServiceDeleteMediaParams } from 'src/application/interfaces/services/media/media-rest/methods/delete-media.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

type IDeleteMediaIndexes = Pick<IMediaRestServiceDeleteMediaParams, 'id'>;

export class DeleteMediaReqDTO
  extends PickType(MediaValidatorDTO, ['id'] as const)
  implements IDeleteMediaIndexes {}
