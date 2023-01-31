// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { User } from 'src/modules/apps/user/domain/entities/user';

export class SearchUserResDTO extends PickType(User, [
  'id',
  'medias',
  'username',
  'email',
  'role',
] as const) {}
