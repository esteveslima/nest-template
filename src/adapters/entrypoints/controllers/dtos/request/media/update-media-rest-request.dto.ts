// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMediaRestServiceModifyMediaParams } from 'src/application/interfaces/services/media/media-rest/methods/modify-media.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

type IUpdateMediaIndexes = Pick<
  IMediaRestServiceModifyMediaParams['indexes'],
  'id'
>;
type IUpdateMediaData = Required<IMediaRestServiceModifyMediaParams['data']>;

export class UpdateMediaRestRequestParamsDTO
  extends PickType(MediaValidatorDTO, ['id'] as const)
  implements IUpdateMediaIndexes {}

export class UpdateMediaRestRequestBodyDTO
  extends PickType(MediaValidatorDTO, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
    'available',
  ] as const)
  implements IUpdateMediaData {}
