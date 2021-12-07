// Object encapsulating data required for an operation response
// Extends base DTO, which already contains pipe validations and transformation decorators(requires the Expose decorator to keep the property across the response serialization)

import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { UserDTO } from '../base/user.dto';

export class GetUserResDTO extends PickType(UserDTO, [
  'id',
  'createdAt',
  'medias',
  'username',
  'email',
  'role',
  'gender',
  'age',
] as const) {}
