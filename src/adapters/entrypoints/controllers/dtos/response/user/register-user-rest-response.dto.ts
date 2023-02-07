// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IUserRestServiceRegisterUserResult } from 'src/application/interfaces/services/user/user-rest/methods/register-user.interface';
import { UserValidatorDTO } from '../../request/user/base/user-validator.dto';

export class RegisterUserRestResponseDTO
  extends PickType(UserValidatorDTO, [
    'id',
    'medias',
    'username',
    'email',
    'role',
    'gender',
    'age',
  ] as const)
  implements IUserRestServiceRegisterUserResult {}
