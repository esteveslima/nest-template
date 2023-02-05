import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { IUserGraphqlServiceModifyUserParams } from 'src/modules/apps/user/application/interfaces/services/user-graphql/methods/modify-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';

type IUpdateUser = IUserGraphqlServiceModifyUserParams['indexes'] &
  IUserGraphqlServiceModifyUserParams['data'];

@ArgsType()
export class UpdateUserArgsDTO
  extends PartialType(
    PickType(UserBaseArgsDTO, [
      'username',
      // 'password',
      'email',
      'gender',
      'age',
    ] as const),
  )
  implements IUpdateUser
{
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 80)
  password?: string;
}
