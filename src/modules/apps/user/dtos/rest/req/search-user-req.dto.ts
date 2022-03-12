// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { UserEntityValidateDTO } from '../../base/user-entity-validate.dto';

// search filters
export class SearchUserReqDTO extends PartialType(
  PickType(UserEntityValidateDTO, ['username', 'email'] as const),
) {}
