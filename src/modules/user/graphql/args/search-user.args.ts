import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { UserEntityBaseArgs } from './base/user-entity-base.args';

@ArgsType()
export class SearchUserArgs extends PartialType(
  PickType(UserEntityBaseArgs, ['username', 'email'] as const),
) {}
