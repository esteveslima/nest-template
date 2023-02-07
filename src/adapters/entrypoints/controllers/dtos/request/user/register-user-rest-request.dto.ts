// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IUserRestServiceRegisterUserParams } from 'src/application/interfaces/services/user/user-rest/methods/register-user.interface';
import { UserValidatorDTO } from './base/user-validator.dto';

export class RegisterUserRestRequestDTO
  extends PickType(UserValidatorDTO, [
    'username',
    'password',
    'email',
    'role',
    'gender',
    'age',
  ] as const)
  implements IUserRestServiceRegisterUserParams {}
