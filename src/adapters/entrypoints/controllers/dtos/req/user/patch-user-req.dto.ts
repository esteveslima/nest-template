// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IUserRestServiceModifyUserParams } from 'src/application/interfaces/services/user/user-rest/methods/modify-user.interface';
import { UserValidatorDTO } from './base/user-validator.dto';

type IPatchUserIndexes = IUserRestServiceModifyUserParams['indexes'];
type IPatchUserData = IUserRestServiceModifyUserParams['data'];

export class PatchUserReqParamsDTO
  extends PickType(UserValidatorDTO, ['id'] as const)
  implements IPatchUserIndexes {}

export class PatchUserReqBodyDTO
  extends PartialType(
    PickType(UserValidatorDTO, [
      'username',
      'password',
      'email',
      'gender',
      'age',
    ] as const),
  )
  implements IPatchUserData {}
