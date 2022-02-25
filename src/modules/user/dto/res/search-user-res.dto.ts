// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { UserEntityBaseDTO } from '../base/user-entity-base.dto';

export class SearchUserResDTO extends PickType(UserEntityBaseDTO, [
  'id',
  'medias',
  'username',
  'email',
  'role',
] as const) {}
