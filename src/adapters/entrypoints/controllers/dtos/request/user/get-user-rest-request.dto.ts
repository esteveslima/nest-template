// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IUserRestServiceGetUserParams } from 'src/application/interfaces/services/user/user-rest/methods/get-user.interface';
import { UserValidatorDTO } from './base/user-validator.dto';

// search filters
export class GetUserRestRequestDTO
  extends PickType(UserValidatorDTO, ['id'] as const)
  implements IUserRestServiceGetUserParams {}
