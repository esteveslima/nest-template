import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class SearchUserArgsDTO extends PartialType(
  PickType(UserBaseArgsDTO, ['username', 'email'] as const),
) {}
