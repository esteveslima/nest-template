import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceSearchUserParams } from 'src/modules/apps/user/application/interfaces/services/user-graphql/methods/search-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class SearchUserArgsDTO
  extends PartialType(PickType(UserBaseArgsDTO, ['username', 'email'] as const))
  implements IUserGraphqlServiceSearchUserParams {}
