// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IUserRestServiceModifyUserParams } from 'src/modules/apps/user/application/interfaces/services/user-rest/methods/modify-user.interface';
import { UserValidatorDTO } from './base/user-validator.dto';

type IUpdateUserIndexes = IUserRestServiceModifyUserParams['indexes'];
type IUpdateUserData = Required<IUserRestServiceModifyUserParams['data']>;

export class UpdateUserReqParamsDTO
  extends PickType(UserValidatorDTO, ['id'] as const)
  implements IUpdateUserIndexes {}

export class UpdateUserReqBodyDTO
  extends PickType(UserValidatorDTO, [
    'username',
    'password',
    'email',
    'gender',
    'age',
  ] as const)
  implements IUpdateUserData {}
