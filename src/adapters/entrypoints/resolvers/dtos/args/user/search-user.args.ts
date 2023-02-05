import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceSearchUsersParams } from 'src/application/interfaces/services/user/user-graphql/methods/search-users.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class SearchUserArgsDTO
  extends PartialType(PickType(UserBaseArgsDTO, ['username', 'email'] as const))
  implements IUserGraphqlServiceSearchUsersParams {}
