// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { MediaEntityValidateDTO } from '../../base/media-entity-validate.dto';

export class PatchMediaReqDTO extends PartialType(
  PickType(MediaEntityValidateDTO, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
    'available',
  ] as const),
) {}
