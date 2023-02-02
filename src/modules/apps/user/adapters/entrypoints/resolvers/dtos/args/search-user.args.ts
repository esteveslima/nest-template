import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceSearchUsersParams } from 'src/modules/apps/user/application/interfaces/services/user-graphql/methods/search-users.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class SearchUserArgsDTO
  extends PartialType(PickType(UserBaseArgsDTO, ['username', 'email'] as const))
  implements IUserGraphqlServiceSearchUsersParams {}
