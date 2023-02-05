// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMediaRestServiceRegisterMediaParams } from 'src/application/interfaces/services/media/media-rest/methods/register-media.interface';
import { MediaValidatorDTO } from './base/media-validator.dto';

type IRegisterMediaData = Omit<IMediaRestServiceRegisterMediaParams, 'user'>;

export class RegisterMediaReqBodyDTO
  extends PickType(MediaValidatorDTO, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
  ] as const)
  implements IRegisterMediaData {}
