import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { UserEntityBaseArgsDTO } from '../base/user-entity-base.args';
@ArgsType()
export class SearchUserArgsDTO extends PartialType(
  PickType(UserEntityBaseArgsDTO, ['username', 'email'] as const),
) {}
