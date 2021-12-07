// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { UserDTO } from '../base/user.dto';

export class UpdateUserReqDTO extends PickType(UserDTO, [
  'medias',
  'username',
  'password',
  'email',
  'gender',
  'age',
] as const) {}
