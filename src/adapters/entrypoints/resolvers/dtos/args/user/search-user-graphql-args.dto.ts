import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceSearchUsersParams } from 'src/application/interfaces/services/user/user-graphql/methods/search-users.interface';
import { UserBaseGraphqlArgsDTO } from './base/user-base-graphql-args.dto';
@ArgsType()
export class SearchUserGraphqlArgsDTO
  extends PartialType(
    PickType(UserBaseGraphqlArgsDTO, ['username', 'email'] as const),
  )
  implements IUserGraphqlServiceSearchUsersParams {}
