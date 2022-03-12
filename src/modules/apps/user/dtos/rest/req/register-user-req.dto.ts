// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { UserEntityValidateDTO } from '../../base/user-entity-validate.dto';

export class RegisterUserReqDTO extends PickType(UserEntityValidateDTO, [
  'username',
  'password',
  'email',
  'role',
  'gender',
  'age',
] as const) {}
