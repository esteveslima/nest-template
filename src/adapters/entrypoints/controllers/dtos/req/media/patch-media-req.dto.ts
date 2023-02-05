// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMediaRestServiceModifyMediaParams } from 'src/application/interfaces/services/media/media-rest/methods/modify-media.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

type IPatchMediaIndexes = Pick<
  IMediaRestServiceModifyMediaParams['indexes'],
  'id'
>;
type IPatchMediaData = IMediaRestServiceModifyMediaParams['data'];

export class PatchMediaReqParamsDTO
  extends PickType(MediaValidatorDTO, ['id'] as const)
  implements IPatchMediaIndexes {}

export class PatchMediaReqBodyDTO
  extends PartialType(
    PickType(MediaValidatorDTO, [
      'title',
      'type',
      'description',
      'durationSeconds',
      'contentBase64',
      'available',
    ] as const),
  )
  implements IPatchMediaData {}
