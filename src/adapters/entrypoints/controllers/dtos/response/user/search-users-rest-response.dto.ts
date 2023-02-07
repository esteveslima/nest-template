// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IUserRestServiceSearchUsersResult } from 'src/application/interfaces/services/user/user-rest/methods/search-users.interface';
import { UserValidatorDTO } from '../../request/user/base/user-validator.dto';

type ISearchUsersItem = IUserRestServiceSearchUsersResult[0];

export class SearchUsersRestResponseDTO
  extends PickType(UserValidatorDTO, [
    'id',
    'medias',
    'username',
    'email',
    'role',
  ] as const)
  implements ISearchUsersItem {}
