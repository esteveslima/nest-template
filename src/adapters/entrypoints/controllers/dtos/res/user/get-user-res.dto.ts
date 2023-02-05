// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IUserRestServiceGetUserResult } from 'src/application/interfaces/services/user/user-rest/methods/get-user.interface';
import { UserValidatorDTO } from '../../req/user/base/user-validator.dto';

export class GetUserResDTO
  extends PickType(UserValidatorDTO, [
    'id',
    'createdAt',
    'medias',
    'username',
    'email',
    'role',
    'gender',
    'age',
  ] as const)
  implements IUserRestServiceGetUserResult {}
